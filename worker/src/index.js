/**
 * 萃英电子联盟投稿 Worker
 *
 * 绑定：
 *   SUBMISSIONS  KV   投稿记录（sub:<id>）
 *   FILES        R2   投稿文件（sub/<id>/<文件名>）
 * 变量 / 密钥：
 *   GITHUB_REPO     例 "max133777/Firefly"
 *   GITHUB_BRANCH   例 "master"
 *   ALLOWED_ORIGIN  例 "https://cuiyingdianzi.com"
 *   ADMIN_TOKEN     审核口令（secret）
 *   GITHUB_TOKEN    fine-grained PAT，仅该仓库 contents:write（secret）
 *
 * 接口：
 *   POST /api/submit                 投稿（multipart）
 *   GET  /api/mine?submitter=<id>    我的投稿
 *   GET  /api/file/<id>/<name>       预览用图片/md
 *   POST /api/admin/list             审核列表（需 X-Admin-Token）
 *   POST /api/admin/review           通过 / 不通过（需 X-Admin-Token）
 */

const CATEGORIES = ["教程", "资料", "技术分享"];
const IMG_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];
const MAX_TOTAL = 40 * 1024 * 1024;
const MAX_FILE = 18 * 1024 * 1024;

const json = (data, status = 200, origin = "*") =>
	new Response(JSON.stringify(data), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"access-control-allow-origin": origin,
			"access-control-allow-headers": "content-type,x-admin-token",
			"access-control-allow-methods": "GET,POST,OPTIONS",
		},
	});

const cors = (env, req) => {
	const allowed = env.ALLOWED_ORIGIN || "*";
	const origin = req.headers.get("Origin") || "";
	if (allowed === "*") return "*";
	return allowed.split(",").map((s) => s.trim()).includes(origin) ? origin : allowed;
};

/**
 * 文件存储：优先用 R2（绑定了 FILES 时），否则回退到 KV（键前缀 file:）。
 * KV 单个值上限 25MiB，单个文件别超过 ~18MB。
 */
const CONTENT_TYPES = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".avif": "image/avif",
	".md": "text/markdown; charset=utf-8",
	".markdown": "text/markdown; charset=utf-8",
};

const contentTypeOf = (name) => CONTENT_TYPES[extOf(name)] || "application/octet-stream";

async function storePut(env, key, data) {
	const type = contentTypeOf(key);
	if (env.FILES) return env.FILES.put(key, data, { httpMetadata: { contentType: type } });
	return env.SUBMISSIONS.put(`file:${key}`, data, { metadata: { contentType: type } });
}

async function storeGet(env, key) {
	if (env.FILES) return env.FILES.get(key);
	const { value, metadata } = await env.SUBMISSIONS.getWithMetadata(`file:${key}`, "arrayBuffer");
	if (!value) return null;
	const buf = value;
	return {
		body: buf,
		arrayBuffer: async () => buf,
		httpMetadata: { contentType: metadata?.contentType || contentTypeOf(key) },
	};
}

const extOf = (name) => {
	const i = name.lastIndexOf(".");
	return i < 0 ? "" : name.slice(i).toLowerCase();
};

const slugify = (title, fallback = "post") => {
	const ascii = (title || "")
		.normalize("NFKD")
		.replace(/[^\x00-\x7F]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	return ascii || `${fallback}-${Date.now().toString(36)}`;
};

const parseFrontmatter = (md) => {
	const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return {};
	const out = {};
	for (const line of m[1].split(/\r?\n/)) {
		const i = line.indexOf(":");
		if (i < 0) continue;
		out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
	}
	return out;
};

/** 校验：返回错误信息数组（空数组表示合格） */
function validate({ mdText, author, categories, coverName, imageNames }) {
	const errs = [];
	if (!mdText || !mdText.trim()) errs.push("缺少 Markdown 正文文件");
	if (!author || !author.trim()) errs.push("缺少作者");
	if (!categories || categories.length === 0) errs.push("至少要选一个文章类型");
	for (const c of categories || []) if (!CATEGORIES.includes(c)) errs.push(`不支持的文章类型：${c}`);
	if (!coverName) errs.push("缺少文章封面");

	const refs = [...(mdText || "").matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1].trim());
	const local = refs.filter((r) => !/^https?:\/\//i.test(r) && !r.startsWith("data:"));
	const uploaded = new Set(imageNames || []);
	if (uploaded.size && local.length) {
		for (const r of local) {
			const base = decodeURIComponent(r).split("/").pop();
			if (!uploaded.has(base)) errs.push(`正文引用的图片没上传：${base}`);
		}
	} else if (local.length && !uploaded.size) {
		errs.push(`正文引用了 ${local.length} 张本地图片，但没有上传图片文件`);
	}
	// 封面必须在图片里或单独上传
	if (coverName && uploaded.size && !uploaded.has(coverName)) {
		// 封面单独上传也算，这里不报错，仅提示
	}
	return errs;
}

/** 把审稿通过的文章提交到 GitHub（生成一次提交） */
async function publishToGitHub(env, sub, files) {
	const [owner, repo] = (env.GITHUB_REPO || "").split("/");
	const branch = env.GITHUB_BRANCH || "master";
	if (!owner || !repo) throw new Error("未配置 GITHUB_REPO");
	const api = `https://api.github.com/repos/${owner}/${repo}`;
	const headers = {
		authorization: `Bearer ${env.GITHUB_TOKEN}`,
		accept: "application/vnd.github+json",
		"user-agent": "cyea-submit-worker",
	};

	const slug = sub.slug || slugify(sub.title, "post");
	// 图片统一重命名 image-1..N，正文引用同步改写
	const imageNames = files.filter((f) => IMG_EXT.includes(extOf(f.name))).map((f) => f.name);
	const renamed = new Map();
	let n = 0;
	for (const name of imageNames) {
		if (name === sub.coverName) continue;
		n += 1;
		renamed.set(name, `image-${n}${extOf(name)}`);
	}
	const coverBase = sub.coverName ? slugify(sub.title, "cover") : "cover";
	const coverTarget = `cover${extOf(sub.coverName || ".png")}`;
	renamed.set(sub.coverName, coverTarget);

	let body = files.find((f) => f.name === sub.mdName)?.text || "";
	body = (body.split(/\r?\n/).slice(0).join("\n")).replace(
		/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
		(whole, alt, src) => {
			if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return whole;
			const base = decodeURIComponent(src).split("/").pop();
			const to = renamed.get(base);
			return to ? `![${alt}](./${to})` : whole;
		},
	);
	// 去掉正文里原有的 frontmatter，统一用下面生成的
	body = body.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();

	const now = new Date();
	const p = (x) => String(x).padStart(2, "0");
	const published = `${now.getUTCFullYear()}-${p(now.getUTCMonth() + 1)}-${p(now.getUTCDate())} ${p(now.getUTCHours())}:${p(now.getUTCMinutes())}:${p(now.getUTCSeconds())}`;
	const fm = parseFrontmatter(files.find((f) => f.name === sub.mdName)?.text || "");
	const categories = sub.categories || [];
	const description = (fm.description || "").slice(0, 120);
	const tags = [`投稿`, ...categories.slice(1)];
	const indexMd = `---
title: ${sub.title}
published: ${published}
description: ${description}
image: ./${coverTarget}
tags: [${[...new Set(tags)].join(", ")}]
category: ${categories[0]}
categories: [${categories.join(", ")}]
author: ${sub.author}
slug: ${slug}
draft: false
---

${body}
`;

	// 1) 取分支当前 commit
	const refRes = await fetch(`${api}/git/ref/heads/${branch}`, { headers });
	if (!refRes.ok) throw new Error(`读取分支失败: ${refRes.status}`);
	const baseSha = (await refRes.json()).object.sha;

	// 2) 逐文件建 blob
	const entries = [];
	const addBlob = async (path, content, encoding) => {
		const r = await fetch(`${api}/git/blobs`, {
			method: "POST",
			headers,
			body: JSON.stringify({ content, encoding }),
		});
		if (!r.ok) throw new Error(`建 blob 失败(${path}): ${r.status}`);
		entries.push({ path, mode: "100644", type: "blob", sha: (await r.json()).sha });
	};

	const dir = `src/content/posts/${slug}`;
	await addBlob(`${dir}/index.md`, indexMd, "utf-8");
	for (const f of files) {
		if (f.name === sub.mdName) continue;
		const target = renamed.get(f.name);
		if (!target) continue;
		await addBlob(`${dir}/${target}`, f.base64, "base64");
	}

	// 3) 建 tree / commit / 更新分支
	const treeRes = await fetch(`${api}/git/trees`, {
		method: "POST",
		headers,
		body: JSON.stringify({ base_tree: (await (await fetch(`${api}/git/commits/${baseSha}`, { headers })).json()).tree.sha, tree: entries }),
	});
	if (!treeRes.ok) throw new Error(`建 tree 失败: ${treeRes.status}`);
	const treeSha = (await treeRes.json()).sha;

	const commitRes = await fetch(`${api}/git/commits`, {
		method: "POST",
		headers,
		body: JSON.stringify({
			message: `post(投稿): ${sub.title}\n\n投稿人: ${sub.author}\n分类: ${categories.join(" / ")}\n投稿ID: ${sub.id}`,
			tree: treeSha,
			parents: [baseSha],
		}),
	});
	if (!commitRes.ok) throw new Error(`建 commit 失败: ${commitRes.status}`);
	const commitSha = (await commitRes.json()).sha;

	const updRes = await fetch(`${api}/git/refs/heads/${branch}`, {
		method: "PATCH",
		headers,
		body: JSON.stringify({ sha: commitSha, force: false }),
	});
	if (!updRes.ok) throw new Error(`更新分支失败: ${updRes.status}`);

	return { slug, commitSha, url: `https://github.com/${owner}/${repo}/commit/${commitSha}` };
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const origin = cors(env, request);
		if (request.method === "OPTIONS") return json({}, 200, origin);

		// 审核口令：HTTP 头只能是 ASCII，所以中文口令在客户端会先做 base64(UTF-8)；
		// 这里两种形式都接受，方便用 curl 直接测。
		const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
		const isAdmin = (req) => {
			const token = req.headers.get("x-admin-token") || "";
			if (!env.ADMIN_TOKEN) return false;
			return token === env.ADMIN_TOKEN || token === b64(env.ADMIN_TOKEN);
		};

		try {
			// ---------- 投稿 ----------
			if (url.pathname === "/api/submit" && request.method === "POST") {
				const form = await request.formData();
				const md = form.get("md");
				const author = String(form.get("author") || "").trim();
				const categories = form.getAll("categories").map(String);
				const submitter = String(form.get("submitter") || "").trim() || "anonymous";
				const imageFiles = form.getAll("images").filter((f) => typeof f === "object" && f.name);
				const cover = form.get("cover");

				if (!(md instanceof File)) return json({ ok: false, errors: ["缺少 Markdown 文件"] }, 400, origin);
				const total = [...imageFiles, cover].filter(Boolean).reduce((s, f) => s + (f.size || 0), 0) + md.size;
				if (total > MAX_TOTAL) return json({ ok: false, errors: ["文件总大小超过 40MB"] }, 413, origin);
				const tooBig = [...imageFiles, cover instanceof File ? cover : null].filter(Boolean).find((f) => f.size > MAX_FILE);
				if (tooBig || md.size > MAX_FILE) {
					return json(
						{ ok: false, errors: [`单个文件不能超过 18MB（KV 存储限制）：${(tooBig || md).name}`] },
						413,
						origin,
					);
				}

				const mdText = await md.text();
				const files = [
					{ name: md.name, text: mdText },
					...imageFiles.map((f) => ({ name: f.name })),
					...(cover instanceof File ? [{ name: cover.name }] : []),
				];
				const errs = validate({
					mdText,
					author,
					categories,
					coverName: cover instanceof File ? cover.name : "",
					imageNames: imageFiles.map((f) => f.name),
				});
				if (errs.length) return json({ ok: false, errors: errs }, 400, origin);

				const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
				const fm = parseFrontmatter(mdText);
				const title = fm.title || (mdText.match(/^\s*#\s+(.+)$/m) || [, md.name.replace(/\.mdx?$/i, "")])[1];

				// R2：存 md 与图片
				await storePut(env, `sub/${id}/${md.name}`, await md.arrayBuffer());
				const all = [
					...(cover instanceof File ? [cover] : []),
					...imageFiles,
				];
				const seen = new Set();
				const stored = [];
				for (const f of all) {
					if (seen.has(f.name)) continue;
					seen.add(f.name);
					await storePut(env, `sub/${id}/${f.name}`, await f.arrayBuffer());
					stored.push(f.name);
				}

				const record = {
					id,
					title,
					author,
					categories,
					submitter,
					status: "pending",
					createdAt: new Date().toISOString(),
					mdName: md.name,
					coverName: cover instanceof File ? cover.name : stored[0] || "",
					files: stored,
					description: (fm.description || "").slice(0, 120),
					reason: "",
					published: null,
				};
				await env.SUBMISSIONS.put(`sub:${id}`, JSON.stringify(record));
				return json({ ok: true, id, title }, 200, origin);
			}

			// ---------- 我的投稿 ----------
			if (url.pathname === "/api/mine" && request.method === "GET") {
				const submitter = url.searchParams.get("submitter") || "";
				const list = await env.SUBMISSIONS.list({ prefix: "sub:" });
				const items = [];
				for (const key of list.keys) {
					const rec = JSON.parse((await env.SUBMISSIONS.get(key.name)) || "null");
					if (rec && rec.submitter === submitter) items.push(rec);
				}
				items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
				return json({ ok: true, items }, 200, origin);
			}

			// ---------- 文件（预览用）----------
			if (url.pathname.startsWith("/api/file/")) {
				const rest = url.pathname.slice("/api/file/".length);
				const slash = rest.indexOf("/");
				const id = rest.slice(0, slash);
				const name = decodeURIComponent(rest.slice(slash + 1));
				const obj = await storeGet(env, `sub/${id}/${name}`);
				if (!obj) return new Response("not found", { status: 404, headers: { "access-control-allow-origin": origin } });
				// 预览页要用 fetch() 取正文/图片，必须带 CORS 头，否则浏览器报 Failed to fetch
				return new Response(obj.body, {
					headers: {
						"content-type": obj.httpMetadata?.contentType || "application/octet-stream",
						"access-control-allow-origin": origin,
						"cache-control": "private, max-age=60",
					},
				});
			}

			// ---------- 审核：列表 ----------
			if (url.pathname === "/api/admin/list" && request.method === "POST") {
				if (!isAdmin(request)) return json({ ok: false, error: "无权限" }, 401, origin);
				const body = await request.json().catch(() => ({}));
				const want = body.status || "pending";
				const list = await env.SUBMISSIONS.list({ prefix: "sub:" });
				const items = [];
				for (const key of list.keys) {
					const rec = JSON.parse((await env.SUBMISSIONS.get(key.name)) || "null");
					if (rec && (want === "all" || rec.status === want)) items.push(rec);
				}
				items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
				return json({ ok: true, items }, 200, origin);
			}

			// ---------- 审核：通过 / 不通过 ----------
			if (url.pathname === "/api/admin/review" && request.method === "POST") {
				if (!isAdmin(request)) return json({ ok: false, error: "无权限" }, 401, origin);
				const { id, action, reason } = await request.json();
				const raw = await env.SUBMISSIONS.get(`sub:${id}`);
				if (!raw) return json({ ok: false, error: "投稿不存在" }, 404, origin);
				const rec = JSON.parse(raw);

				if (action === "approve") {
					const files = [];
					for (const name of [rec.mdName, ...rec.files]) {
						const obj = await storeGet(env, `sub/${id}/${name}`);
						if (!obj) continue;
						const buf = new Uint8Array(await obj.arrayBuffer());
						if (name === rec.mdName) {
							files.push({ name, text: new TextDecoder().decode(buf) });
						} else {
							let bin = "";
							for (const b of buf) bin += String.fromCharCode(b);
							files.push({ name, base64: btoa(bin) });
						}
					}
					const result = await publishToGitHub(env, rec, files);
					rec.status = "approved";
					rec.published = { ...result, at: new Date().toISOString() };
				} else {
					rec.status = "rejected";
					rec.reason = String(reason || "").slice(0, 300);
				}
				await env.SUBMISSIONS.put(`sub:${id}`, JSON.stringify(rec));
				return json({ ok: true, item: rec }, 200, origin);
			}

			return json({ ok: false, error: "not found" }, 404, origin);
		} catch (error) {
			return json({ ok: false, error: String(error?.message || error) }, 500, origin);
		}
	},
};
