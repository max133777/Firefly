/**
 * 投稿/文章校验：给 CI（PR）和本地用
 *   node scripts/validate-posts.mjs            # 校验全部文章
 *   node scripts/validate-posts.mjs <目录或文件>  # 只校验指定文章
 *
 * 检查项：
 *  1. frontmatter 必填：title / published / category / author / slug
 *  2. category 只能是 技术分享 / 教程 / 资料
 *  3. published 能被解析
 *  4. 正文引用的本地图片必须存在；文章目录里的图片必须都被引用
 *  5. 图片引用的路径格式必须是 ./xxx（与主题约定一致）
 * 退出码非 0 表示校验失败（CI 会红）
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const POSTS_DIR = join(process.cwd(), "src", "content", "posts");
const CATEGORIES = ["技术分享", "教程", "资料"];
const IMG = /\.(png|jpe?g|webp|gif|avif)$/i;

const errors = [];
const warnings = [];

function checkPost(dir) {
	const mdPath = join(dir, "index.md");
	const rel = relative(process.cwd(), dir);
	if (!existsSync(mdPath)) {
		errors.push(`${rel}: 缺少 index.md`);
		return;
	}
	const md = readFileSync(mdPath, "utf8");
	const fm = md.match(/^---\n([\s\S]*?)\n---/);
	if (!fm) {
		errors.push(`${rel}: 缺少 frontmatter`);
		return;
	}
	const get = (key) => {
		const m = fm[1].match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
		return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
	};

	for (const key of ["title", "published", "category", "author", "slug"]) {
		if (!get(key)) errors.push(`${rel}: frontmatter 缺 ${key}`);
	}
	const category = get("category");
	if (category && !CATEGORIES.includes(category)) {
		errors.push(`${rel}: category 必须是 ${CATEGORIES.join(" / ")}，当前 "${category}"`);
	}
	const published = get("published");
	if (published && Number.isNaN(new Date(published).getTime())) {
		errors.push(`${rel}: published 无法解析："${published}"`);
	}
	if (/[Tt]\d{2}:\d{2}/.test(published) === false && /^\d{4}-\d{2}-\d{2}$/.test(published)) {
		warnings.push(`${rel}: published 只写了日期，动态页会显示 00:00:00（建议写具体时分）`);
	}

	// 图片
	const body = md.replace(/^---[\s\S]*?\n---/, "");
	const refs = [...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1].trim());
	const files = readdirSync(dir).filter((f) => IMG.test(f));
	const cover = get("image");
	// 封面图可以只出现在 frontmatter 里，算作「已使用」，不算未引用
	const coverFile = cover.startsWith("./") ? cover.replace(/^\.\//, "") : "";
	const localRefs = [];
	for (const r of refs) {
		if (/^https?:\/\//i.test(r) || r.startsWith("data:")) continue;
		const clean = r.replace(/^\.\//, "");
		localRefs.push(clean);
		if (!r.startsWith("./")) errors.push(`${rel}: 图片路径应写成 ./xxx 形式："${r}"`);
		if (!existsSync(join(dir, clean))) errors.push(`${rel}: 引用的图片不存在："${r}"`);
	}
	if (coverFile) localRefs.push(coverFile);
	for (const f of files) {
		if (!localRefs.includes(f)) warnings.push(`${rel}: 图片未被正文引用："${f}"（建议删除）`);
	}
	if (files.length === 0 && refs.some((r) => /^https?:\/\//i.test(r))) {
		warnings.push(`${rel}: 正文用的是外链图片，建议下载到本地文章目录`);
	}

	if (cover && cover.startsWith("./") && !existsSync(join(dir, cover.replace(/^\.\//, "")))) {
		errors.push(`${rel}: 封面图不存在："${cover}"`);
	}
	console.log(
		`  ✓ ${rel}  (图片 ${files.length}，引用 ${localRefs.length}，分类 ${category || "?"})`,
	);
}

// ---------- 目标 ----------
const target = process.argv[2];
let dirs = [];
if (target) {
	const abs = join(process.cwd(), target);
	if (!existsSync(abs)) {
		console.error(`找不到目标: ${target}`);
		process.exit(1);
	}
	dirs = existsSync(join(abs, "index.md")) ? [abs] : [abs];
} else if (existsSync(POSTS_DIR)) {
	dirs = readdirSync(POSTS_DIR)
		.map((d) => join(POSTS_DIR, d))
		.filter((d) => statSync(d).isDirectory());
}

console.log(`校验 ${dirs.length} 篇文章：`);
for (const d of dirs) checkPost(d);

if (warnings.length) {
	console.log(`\n提示 (${warnings.length})：`);
	for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
	console.error(`\n错误 (${errors.length})：`);
	for (const e of errors) console.error(`  ✗ ${e}`);
	process.exit(1);
}
console.log("\n全部通过 ✓");
