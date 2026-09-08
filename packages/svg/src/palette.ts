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
		body: "#f0e2b8",
		shadow: "#d4c089",
		accent: "#4f7d32",
		accentSoft: "#c5d6a0",
		ink: "#3a2a18",
	},
	water: {
		body: "#cfeef2",
		shadow: "#9ecdd6",
		accent: "#1f8498",
		accentSoft: "#9ad4de",
		ink: "#163e48",
	},
	air: {
		body: "#f3f6fb",
		shadow: "#c9d6e6",
		accent: "#6a9cc8",
		accentSoft: "#d5e6f5",
		ink: "#334a62",
	},
	fire: {
		body: "#f8d9c4",
		shadow: "#e3b08e",
		accent: "#e05a24",
		accentSoft: "#f2b48a",
		ink: "#5a2612",
	},
	psy: {
		body: "#e6d7f4",
		shadow: "#c7b0dc",
		accent: "#6941a0",
		accentSoft: "#d0b6ea",
		ink: "#322044",
	},
};
