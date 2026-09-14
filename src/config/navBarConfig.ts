import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

const links: NavBarLink[] = [
	{ name: "主页", url: "/", icon: "material-symbols:home" },
	{ name: "教程", url: "/tutorials/", icon: "material-symbols:menu-book" },
	{
		name: "资料",
		url: "/resources/",
		icon: "material-symbols:folder-open-rounded",
	},
	{ name: "技术分享", url: "/share/", icon: "material-symbols:code" },
	{
		name: "归档",
		url: "/archive/",
		icon: "material-symbols:archive-outline-rounded",
	},
	{ name: "关于", url: "/about/", icon: "material-symbols:info" },
];

export const navBarConfig: NavBarConfig = { links };
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};
export const LinkPresets: Record<string, NavBarLink> = {
	Home: links[0],
	Tutorials: links[1],
	Resources: links[2],
	Share: links[3],
	Archive: links[4],
	About: links[5],
};
