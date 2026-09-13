import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

const links: NavBarLink[] = [
	{ name: "主页", url: "/", icon: "material-symbols:home" },
	{ name: "教程", url: "/archive/", icon: "material-symbols:menu-book" },
	{ name: "资料", url: "/categories/", icon: "material-symbols:folder-open-rounded" },
	{ name: "技术分享", url: "/tags/", icon: "material-symbols:code" },
	{ name: "关于", url: "/about/", icon: "material-symbols:info" },
];

export const navBarConfig: NavBarConfig = { links };

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const LinkPresets: Record<string, NavBarLink> = {
	Home: links[0],
	Archive: links[1],
	Categories: links[2],
	Tags: links[3],
	About: links[4],
};
