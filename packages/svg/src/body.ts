import type { GrowthStage } from "@gittygotchi/domain";
import type { ClassPalette } from "./palette.ts";

export function isEggStage(stage: GrowthStage): boolean {
	return stage === "egg";
}

export function bodyScale(stage: GrowthStage): number {
	switch (stage) {
		case "egg":
			return 1;
		case "hatchling":
			return 1;
		case "baby":
			return 1.04;
		case "young":
			return 1.08;
		case "adult":
			return 1.12;
		case "mature":
			return 1.16;
		default: {
			const exhaustive: never = stage;
			return exhaustive;
		}
	}
}

export function renderEgg(palette: ClassPalette): string {
	return `
		<ellipse cx="120" cy="196" rx="46" ry="10" fill="${palette.shadow}" opacity="0.45"/>
		<ellipse cx="120" cy="132" rx="56" ry="70" fill="${palette.body}" stroke="${palette.ink}" stroke-width="4"/>
		<ellipse cx="120" cy="88" rx="32" ry="16" fill="#fff7ea" opacity="0.55"/>`;
}

export function renderHatchling(palette: ClassPalette): string {
	return `
		<ellipse cx="120" cy="198" rx="52" ry="11" fill="${palette.shadow}" opacity="0.45"/>
		<path d="M158 168 Q188 148 196 112" fill="none" stroke="${palette.accent}" stroke-width="10" stroke-linecap="round"/>
		<ellipse cx="86" cy="94" rx="17" ry="30" transform="rotate(-30 86 94)" fill="${palette.body}" stroke="${palette.ink}" stroke-width="3.5"/>
		<ellipse cx="154" cy="94" rx="17" ry="30" transform="rotate(30 154 94)" fill="${palette.body}" stroke="${palette.ink}" stroke-width="3.5"/>
		<ellipse cx="88" cy="98" rx="7" ry="14" transform="rotate(-30 88 98)" fill="${palette.accentSoft}"/>
		<ellipse cx="152" cy="98" rx="7" ry="14" transform="rotate(30 152 98)" fill="${palette.accentSoft}"/>
		<ellipse cx="120" cy="148" rx="50" ry="42" fill="${palette.body}" stroke="${palette.ink}" stroke-width="4"/>
		<ellipse cx="102" cy="186" rx="12" ry="8" fill="${palette.body}" stroke="${palette.ink}" stroke-width="3"/>
		<ellipse cx="138" cy="186" rx="12" ry="8" fill="${palette.body}" stroke="${palette.ink}" stroke-width="3"/>`;
}
