import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题，留空则走i18n默认标题
	title: "",

	// 公告内容（支持 HTML，可放多个链接）
	content:
		'欢迎来到萃英电子联盟！<br />bilibili：<a class="transition link text-(--primary) font-medium" href="https://space.bilibili.com/670495028?spm_id_from=333.1365.0.0" target="_blank" rel="noopener noreferrer">max133777</a><br />立创开源硬件平台：<a class="transition link text-(--primary) font-medium" href="https://oshwhub.com/max1337?jlc_vid=T1laVwZRR1RYUABSFAVcVlNeT1dWUVIDFlgNBAJREVkxVlNeTlRdX1xWQ1BWVjtWKA4dDxMOAgNABAsL" target="_blank" rel="noopener noreferrer">max1337</a><br />社团仓库：<a class="transition link text-(--primary) font-medium" href="https://gitcode.com/cyea" target="_blank" rel="noopener noreferrer">萃英电子联盟</a><br />QQ 群：538094442',

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "了解我们",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
