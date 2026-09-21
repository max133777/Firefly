/**
 * 投稿系统配置
 *
 * 后端是一个独立的 Cloudflare Worker（代码在仓库 worker/ 目录），
 * 部署后把它的地址填到 apiBase 即可（末尾不要带 /）。
 * 例：apiBase: "https://cyea-submit.xxxx.workers.dev"
 */
export const submitConfig = {
	/** Worker 地址；留空表示后端尚未部署（页面会提示） */
	apiBase: "https://cyea-submit.predictionmax8766.workers.dev",

	/** 允许投稿的分类（可多选） */
	categories: ["教程", "资料", "技术分享"] as const,

	/** 可接受的文件类型 */
	accept: {
		markdown: [".md", ".markdown"],
		image: [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"],
	},

	/** 单次投稿的大小上限（字节），与 Worker 端保持一致 */
	maxTotalBytes: 40 * 1024 * 1024,
} as const;

export type SubmitConfig = typeof submitConfig;
