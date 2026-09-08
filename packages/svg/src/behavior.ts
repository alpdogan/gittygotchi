import type { Behavior } from "@gittygotchi/domain";
import type { ClassPalette } from "./palette.ts";

export function renderBehaviorExtras(behavior: Behavior, palette: ClassPalette): string {
	switch (behavior) {
		case "sleeping":
		case "sleepy":
		case "hibernating":
			return `
				<g class="gitty-zzz" fill="${palette.ink}" font-family="ui-rounded, system-ui, sans-serif" font-size="14" font-weight="700">
					<text x="168" y="64">z</text>
					<text x="182" y="50" font-size="18">z</text>
					<text x="198" y="34" font-size="22">z</text>
				</g>`;
		case "eating":
			return `
				<circle cx="148" cy="176" r="3.2" fill="${palette.accent}"/>
				<circle cx="158" cy="170" r="2.4" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1"/>`;
		case "playing":
		case "idle":
		case "resting":
			return "";
		default: {
			const exhaustive: never = behavior;
			return exhaustive;
		}
	}
}

export function motionClass(behavior: Behavior): string {
	return `gitty-${behavior}`;
}
