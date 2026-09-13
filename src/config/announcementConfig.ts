import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题，留空则走i18n默认标题
	title: "",

	// 公告内容
	content:
		"欢迎来到萃英电子联盟！网站正在搭建完善中，教程、资料与技术分享会陆续上线。",

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
