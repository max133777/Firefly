// 构建前清空 Astro 的内容层 / 构建缓存。
//
// 背景（2026-09 线上故障）：Cloudflare Workers Builds 会缓存并复用上一次构建的
// node_modules，而 Astro 的内容层缓存 node_modules/.astro/data-store.json 正好也在
// node_modules 里面。当文章被删除或改名后，这份旧缓存里的条目仍然指向已经不存在
// 的图片，构建会以 ImageNotFound 直接失败；Cloudflare 构建失败后会继续沿用上一个
// 成功的产物，于是线上看起来"一直没更新"。
//
// 这里在每次构建前强制清掉这些缓存，保证构建结果只取决于当前工作区的源码，
// 不受 CI 缓存影响（清理后 Astro 会自行重新生成，代价约 1~2 秒）。
import { rmSync } from "node:fs";
import { join } from "node:path";

/** 需要清理的目录，相对于项目根目录 */
const cacheDirs: string[] = [
	// Astro 内容层与类型缓存（项目根目录）
	".astro",
	// Astro 内容层缓存（会被 Cloudflare 随 node_modules 一起缓存，是本次故障的元凶）
	join("node_modules", ".astro"),
	// 上一次的构建产物，避免被 CI 的 build output cache 还原出已删除的页面
	"dist",
];

for (const dir of cacheDirs) {
	rmSync(join(process.cwd(), dir), { recursive: true, force: true });
	console.log(`[clean-cache] 已清理 ${dir}`);
}
