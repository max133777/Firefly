import type { BackgroundWallpaperConfig } from "@/types/backgroundWallpaper";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	mode: "banner",
	playerEnable: false,
	src: {
		desktop: "assets/images/DesktopWallpaper/cyea_logo_4.png",
		mobile: "assets/images/MobileWallpaper/cyea_logo_4.png",
		playerUrl: "",
	},
	common: {
		dimOpacity: 0.2,
		playerMode: "order",
		homeText: {
			enable: true,
			title: "萃英电子联盟",
			subtitle: ["电子技术学习 · 实践 · 分享"],
			titleSize: "4.5rem",
			subtitleSize: "1.5rem",
			typewriter: {
				enable: false,
				speed: 100,
				deleteSpeed: 50,
				pauseTime: 2000,
			},
			linksEnable: true,
			links: [
				{ name: "资料归档", icon: "material-symbols:menu-book", url: "/archive/" },
				{ name: "技术分享", icon: "material-symbols:code", url: "/tags/" },
			],
		},
		carousel: { enable: false, interval: 5000, transitionEffect: "zoom" },
		waves: { enable: { desktop: true, mobile: true } },
		gradient: { enable: { desktop: true, mobile: true }, height: "10%" },
	},
	banner: {
		position: "center center",
		postInfo: { mode: "description" },
		navbar: { transparentMode: "semi", blur: 8 },
	},
};
