/**
 * 投稿规范化脚本：把 md / docx / tex 统一转成站点的文章目录
 *
 *   pnpm submit <文件> [--title 标题] [--category 技术分享|教程|资料]
 *                      [--author max1337] [--slug xxx] [--tags a,b]
 *                      [--desc 一句话简介] [--draft]
 *
 * 产物：src/content/posts/<slug>/index.md + image-1..N（正文里的图片引用已改成本地相对路径）
 * 之后由投稿人/审核人走 GitHub PR 流程，审核通过合并即自动部署。
 *
 * 约定（与 SKILL 一致）：
 *  - 正文里的图片一律复制进文章目录并重命名为 image-N
 *  - published 用「电脑当前日期时间」（主题是 UTC 朴素时间约定）
 *  - 分类只能是 技术分享 / 教程 / 资料
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { pinyin } from "pinyin-pro";

const POSTS_DIR = join(process.cwd(), "src", "content", "posts");
const CATEGORIES = ["技术分享", "教程", "资料"];

// ---------- 参数 ----------
const argv = process.argv.slice(2);
const file = argv.find((a) => !a.startsWith("--"));
const opt = (name, fallback = "") => {
	const i = argv.indexOf(`--${name}`);
	return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};
const flag = (name) => argv.includes(`--${name}`);

if (!file || flag("help") || argv.includes("-h")) {
	console.log(`用法: pnpm submit <文件.md|.docx|.tex> [选项]

选项:
  --title <标题>      不填则取正文第一个 # 标题，再退化为文件名
  --category <分类>   ${CATEGORIES.join(" / ")}（默认 技术分享）
  --author <作者>     默认 huns_rundle
  --slug <英文slug>   不填则由标题自动转拼音
  --tags a,b,c        标签，逗号分隔
  --desc <简介>       不填则取正文第一段
  --draft             标记为草稿（线上不显示）
`);
	process.exit(file ? 0 : 1);
}
if (!existsSync(file)) {
	console.error(`找不到文件: ${file}`);
	process.exit(1);
}

const ext = extname(file).toLowerCase();
const category = opt("category", "技术分享");
if (!CATEGORIES.includes(category)) {
	console.error(`分类只能是 ${CATEGORIES.join(" / ")}，收到: ${category}`);
	process.exit(1);
}

// ---------- 时间（必须用电脑当前时间）----------
const pad = (n) => String(n).padStart(2, "0");
const now = new Date();
const published = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

// ---------- 各种格式 -> markdown ----------
let markdown = "";
const tmp = mkdtempSync(join(tmpdir(), "submit-"));

if ([".md", ".markdown", ".mdx"].includes(ext)) {
	markdown = readFileSync(file, "utf8");
	console.log("源格式: Markdown（直接使用）");
} else if (ext === ".docx") {
	const { default: mammoth } = await import("mammoth");
	const { default: TurndownService } = await import("turndown");
	const { value: html, messages } = await mammoth.convertToHtml({ path: file });
	for (const m of messages) if (m.type === "warning") console.warn("  [docx]", m.message);
	const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
	td.keep(["table"]);
	markdown = td.turndown(html);
	console.log("源格式: Word（mammoth -> turndown）");
} else if ([".tex", ".latex"].includes(ext)) {
	const mediaDir = join(tmp, "media");
	console.log("源格式: LaTeX（pandoc -f latex -t gfm）");
	try {
		markdown = execFileSync(
			"pandoc",
			[file, "-f", "latex", "-t", "gfm", "--extract-media", mediaDir, "--wrap=none"],
			{ encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
		);
	} catch (error) {
		console.error("pandoc 转换失败。请确认已安装 pandoc（winget install JohnMacFarlane.Pandoc）并在 PATH 中。");
		console.error(String(error?.message || error));
		process.exit(1);
	}
} else {
	console.error(`不支持的格式: ${ext}（支持 .md / .docx / .tex）`);
	process.exit(1);
}

// ---------- 标题与 slug ----------
const h1 = markdown.match(/^\s*#\s+(.+)$/m);
const title = opt("title") || (h1 ? h1[1].trim() : basename(file, ext));
const toSlug = (text) =>
	[...text]
		.map((ch) => (/[\u4e00-\u9fff]/.test(ch) ? pinyin(ch, { toneType: "none", type: "array" })[0] : ch))
		.join("")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 60) || "post";
const slug = opt("slug") || toSlug(title);

// 若正文第一个 H1 就是标题，去掉它（文章页会单独渲染标题）
let body = markdown.replace(/^\s*#\s+.+\n/, "").replace(/^\s*\n/, "");

// ---------- 图片落地 ----------
const dir = join(POSTS_DIR, slug);
if (existsSync(dir)) {
	console.error(`目录已存在，先删掉或换 --slug: ${dir}`);
	process.exit(1);
}
mkdirSync(dir, { recursive: true });

let imgIndex = 0;
const written = [];
const resolveLocal = (src) => {
	// pandoc --extract-media / 相对路径 / 绝对路径
	const candidates = [src, join(tmp, src), join(join(file, ".."), src)];
	for (const c of candidates) if (c && existsSync(c) && statSync(c).isFile()) return c;
	return null;
};

body = body.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (whole, alt, src) => {
	// data:URI（docx 内嵌图片）
	const dataMatch = src.match(/^data:image\/([a-z0-9+.-]+);base64,(.+)$/i);
	if (dataMatch) {
		const extName = dataMatch[1].toLowerCase() === "jpeg" ? "jpg" : dataMatch[1].toLowerCase();
		imgIndex += 1;
		const name = `image-${imgIndex}.${extName}`;
		writeFileSync(join(dir, name), Buffer.from(dataMatch[2], "base64"));
		written.push(name);
		return `![${alt}](./${name})`;
	}
	// 网络图片保持原样
	if (/^https?:\/\//i.test(src)) return whole;
	const local = resolveLocal(decodeURIComponent(src));
	if (!local) {
		console.warn(`  !! 图片找不到，保持原引用: ${src}`);
		return whole;
	}
	imgIndex += 1;
	const name = `image-${imgIndex}${extname(local).toLowerCase() || ".png"}`;
	copyFileSync(local, join(dir, name));
	written.push(name);
	return `![${alt}](./${name})`;
});

// ---------- description ----------
const firstParagraph =
	body
		.split(/\r?\n/)
		.map((l) => l.trim())
		.find((l) => l && !l.startsWith("!") && !l.startsWith("#") && !l.startsWith("-")) || title;
const description = opt("desc") || firstParagraph.replace(/\s+/g, " ").slice(0, 120);

// ---------- 写 index.md ----------
const tags = opt("tags")
	? opt("tags").split(",").map((t) => t.trim()).filter(Boolean)
	: [];
const frontmatter = `---
title: ${title}
published: ${published}
description: ${description}
image: ${written[0] ? `./${written[0]}` : ""}
tags: [${tags.join(", ")}]
category: ${category}
author: ${opt("author", "huns_rundle")}
slug: ${slug}
draft: ${flag("draft") ? "true" : "false"}
---

`;
writeFileSync(join(dir, "index.md"), frontmatter + body.trim() + "\n", "utf8");

console.log(`
已生成: src/content/posts/${slug}/
  标题    : ${title}
  分类    : ${category}
  作者    : ${opt("author", "huns_rundle")}
  时间    : ${published}
  图片    : ${written.length} 张${written.length ? " (" + written.join(", ") + ")" : ""}
  简介    : ${description.slice(0, 40)}...

接下来（投稿人）:
  git checkout -b post/${slug}
  git add src/content/posts/${slug}
  git commit -m "post: ${title}"
  git push -u origin post/${slug}
  然后在 GitHub 上开 Pull Request，CI 会自动校验，审核通过合并即发布。
`);
