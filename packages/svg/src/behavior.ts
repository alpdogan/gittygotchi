import type { Behavior } from "@gittygotchi/domain";
import type { ClassPalette } from "./palette.ts";

export function renderBehaviorExtras(behavior: Behavior, palette: ClassPalette): string {
	switch (behavior) {
		case "sleeping":
		case "sleepy":
			return zzz(palette);
		case "hibernating":
			return `${zzz(palette)}
				<g class="gitty-detail gitty-zzz" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1">
					<circle cx="52" cy="72" r="2.4"/>
					<circle cx="64" cy="58" r="1.8"/>
					<circle cx="44" cy="54" r="1.6"/>
				</g>`;
		case "eating":
			return `
				<circle cx="148" cy="176" r="3.2" fill="${palette.accent}"/>
				<circle cx="158" cy="170" r="2.4" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1"/>
				<circle class="gitty-detail" cx="140" cy="182" r="1.8" fill="${palette.accent}"/>`;
		case "playing":
			return `
				<g class="gitty-detail" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.5">
					<circle cx="48" cy="168" r="7"/>
					<path d="M48 161 q6 4 0 8 q-6 -4 0 -8" fill="${palette.accentSoft}"/>
				</g>`;
		case "idle":
		case "resting":
			return "";
		default: {
			const exhaustive: never = behavior;
			return exhaustive;
		}
	}
}

function zzz(palette: ClassPalette): string {
	return `
		<g class="gitty-zzz" fill="${palette.ink}" font-family="ui-rounded, system-ui, sans-serif" font-size="14" font-weight="700">
			<text x="168" y="64">z</text>
			<text x="182" y="50" font-size="18">z</text>
			<text x="198" y="34" font-size="22">z</text>
		</g>`;
}

export function motionClass(behavior: Behavior): string {
	return `gitty-${behavior}`;
}
