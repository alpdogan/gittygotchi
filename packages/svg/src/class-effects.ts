import type { GittyClass } from "@gittygotchi/domain";
import type { ClassPalette } from "./palette.ts";

export function renderClassEffects(
	gittyClass: GittyClass,
	palette: ClassPalette,
	kind: "egg" | "creature",
): string {
	switch (gittyClass) {
		case "earth":
			return kind === "egg"
				? `<g fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2">
					<path d="M86 78 q8 -18 4 -28 q12 8 8 26 z"/>
					<path d="M150 80 q-6 -16 2 -26 q10 10 4 26 z"/>
				</g>`
				: `<g fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2">
					<path d="M64 118 q8 -16 2 -26 q12 8 10 24 z"/>
					<path d="M168 116 q-4 -14 4 -24 q10 10 2 24 z"/>
				</g>`;
		case "water":
			return `
				<circle class="gitty-bubble" cx="${kind === "egg" ? 78 : 70}" cy="${kind === "egg" ? 110 : 128}" r="6" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="2" opacity="0.8"/>
				<circle class="gitty-bubble" cx="${kind === "egg" ? 168 : 176}" cy="${kind === "egg" ? 96 : 108}" r="4.5" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="2" opacity="0.7"/>`;
		case "air":
			return `<path class="gitty-spark" d="M${kind === "egg" ? 168 : 176} ${kind === "egg" ? 84 : 78} l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.5"/>`;
		case "fire":
			return `<path class="gitty-flame" d="M${kind === "egg" ? 168 : 196} ${kind === "egg" ? 86 : 108} c8 10 6 22 -2 28 c-10 -8 -8 -18 2 -28 z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2"/>`;
		case "psy":
			return `
				<g class="gitty-psy" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2">
					<path d="M120 ${kind === "egg" ? 78 : 108} l8 10 -8 10 -8 -10 z"/>
					<circle cx="${kind === "egg" ? 72 : 66}" cy="${kind === "egg" ? 100 : 120}" r="3.5"/>
					<circle cx="${kind === "egg" ? 176 : 182}" cy="${kind === "egg" ? 92 : 96}" r="3"/>
					<circle cx="${kind === "egg" ? 160 : 58}" cy="${kind === "egg" ? 70 : 84}" r="2.5"/>
				</g>`;
		default: {
			const exhaustive: never = gittyClass;
			return exhaustive;
		}
	}
}
