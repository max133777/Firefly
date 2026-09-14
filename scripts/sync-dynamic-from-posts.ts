// 把文章的发布 / 更新同步成一条站内「动态」，让侧边栏的「最新动态」自动跟着文章走。
//
// 约定：
// - 每篇文章对应 src/content/dynamic/post-<slug>.md 一条动态（文件名固定，重复执行幂等）
// - 只维护自己生成的 post-*.md，其它手写动态（尤其是置顶动态）一律不碰
// - 文章草稿（draft: true）不生成动态
// - 内容没变就不重写文件，避免每次都产生无意义的改动
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import matter from "gray-matter";

const POSTS_DIR = join(process.cwd(), "src", "content", "posts");
const DYNAMIC_DIR = join(process.cwd(), "src", "content", "dynamic");

/** 递归收集文章文件 */
function collectPostFiles(dir: string, acc: string[] = []): string[] {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			collectPostFiles(full, acc);
		} else if (/\.mdx?$/i.test(entry.name)) {
			acc.push(full);
		}
	}
	return acc;
}

/** 文章在 URL 里使用的 slug：优先 frontmatter.slug，其次按相对路径推导 */
function resolveSlug(frontmatterSlug: unknown, file: string): string {
	if (typeof frontmatterSlug === "string" && frontmatterSlug.trim()) {
		return frontmatterSlug.trim().replace(/^\/+|\/+$/g, "");
	}
	const rel = relative(POSTS_DIR, file).split(sep).join("/");
	const withoutExt = rel.replace(/\.mdx?$/i, "");
	return withoutExt.replace(/\/index$/, "");
}

function formatDateTime(value: unknown): string {
	const date = value instanceof Date ? value : new Date(String(value));
	if (Number.isNaN(date.getTime())) return "";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** 生成动态正文：一句话 + 文章链接 */
function buildBody(title: string, slug: string): string {
	return `发布了新文章《${title}》\n\n[阅读全文](/posts/${slug}/)\n`;
}

mkdirSync(DYNAMIC_DIR, { recursive: true });

const posts = existsSync(POSTS_DIR) ? collectPostFiles(POSTS_DIR) : [];
let created = 0;
let updated = 0;
let unchanged = 0;
let skipped = 0;

for (const file of posts.sort()) {
	const raw = readFileSync(file, "utf8");
	const { data } = matter(raw);

	if (data.draft === true) {
		skipped++;
		continue;
	}

	const title = typeof data.title === "string" ? data.title : "";
	const published = formatDateTime(data.published);
	if (!title || !published) {
		console.warn(`[sync-dynamic] 跳过缺少 title/published 的文章: ${relative(process.cwd(), file)}`);
		skipped++;
		continue;
	}

	const slug = resolveSlug(data.slug, file);
	// 最后活动时间：有 updated 用 updated，否则用 published
	const activity = formatDateTime(data.updated) || published;
	const body = buildBody(title, slug);
	const content = `---\npublished: ${activity}\n---\n\n${body}`;

	const target = join(DYNAMIC_DIR, `post-${slug.replace(/\//g, "-")}.md`);
	if (!existsSync(target)) {
		writeFileSync(target, content, "utf8");
		created++;
		continue;
	}

	const existing = readFileSync(target, "utf8");
	if (existing === content) {
		unchanged++;
	} else {
		writeFileSync(target, content, "utf8");
		updated++;
	}
}

console.log(
	`[sync-dynamic] 新增 ${created} 条，更新 ${updated} 条，未变 ${unchanged} 条，跳过 ${skipped} 篇`,
);
