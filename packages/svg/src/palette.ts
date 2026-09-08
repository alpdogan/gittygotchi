import type { GittyClass } from "@gittygotchi/domain";

export type ClassPalette = {
	body: string;
	shadow: string;
	accent: string;
	accentSoft: string;
	ink: string;
};

export const CLASS_PALETTES: Record<GittyClass, ClassPalette> = {
	earth: {
		body: "#efe3c4",
		shadow: "#d9c89a",
		accent: "#6f8f4e",
		accentSoft: "#c5d6a8",
		ink: "#3d2c1e",
	},
	water: {
		body: "#e3f1f4",
		shadow: "#b9d7de",
		accent: "#3e9aab",
		accentSoft: "#a9d5de",
		ink: "#1f4450",
	},
	air: {
		body: "#eaf3fb",
		shadow: "#c5d8ea",
		accent: "#6ea8d4",
		accentSoft: "#c5e0f4",
		ink: "#2a4660",
	},
	fire: {
		body: "#f8e4d4",
		shadow: "#e8c2a4",
		accent: "#e07a3d",
		accentSoft: "#f0b58a",
		ink: "#5a2e18",
	},
	psy: {
		body: "#eee6f6",
		shadow: "#d3c4e4",
		accent: "#7b5ea7",
		accentSoft: "#cbb6e4",
		ink: "#3b2a52",
	},
};
