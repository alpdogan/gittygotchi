import type { Behavior } from "@gittygotchi/domain";
import type { PrototypePalette } from "./types.ts";

export function renderBehaviorLayer(
	behavior: Behavior,
	palette: PrototypePalette,
): { behind: string; front: string } {
	switch (behavior) {
		case "eating":
			return {
				behind: "",
				front: `
					<g class="behavior-prop food-bowl">
						<ellipse cx="182" cy="194" rx="23" ry="7" fill="${palette.accentSoft}" stroke="${palette.outline}" stroke-width="3"/>
						<path d="M160 193 C163 210 201 210 204 193Z" fill="${palette.accent}" stroke="${palette.outline}" stroke-width="3" stroke-linejoin="round"/>
						<circle cx="176" cy="190" r="4" fill="#a76d45"/>
						<circle cx="186" cy="188" r="4" fill="#a76d45"/>
						<circle cx="195" cy="191" r="3.5" fill="#a76d45"/>
					</g>`,
			};
		case "playing":
			return {
				behind: `
					<g class="behavior-prop play-ball">
						<circle cx="45" cy="188" r="15" fill="${palette.accentSoft}" stroke="${palette.outline}" stroke-width="3"/>
						<path d="M35 181 C43 187 49 193 55 198 M51 176 C46 184 41 192 38 199" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
					</g>`,
				front: "",
			};
		case "sleepy":
			return {
				behind: "",
				front: `<circle class="sleep-particle" cx="183" cy="91" r="4" fill="${palette.accentSoft}"/><circle class="sleep-particle sleep-particle-2" cx="197" cy="75" r="3" fill="${palette.accent}"/>`,
			};
		case "sleeping":
			return {
				behind: "",
				front: zzz(palette, false),
			};
		case "hibernating":
			return {
				behind: `<ellipse cx="127" cy="204" rx="69" ry="17" fill="${palette.accentSoft}" opacity=".42"/>`,
				front: `${zzz(palette, true)}<path d="M72 186 C91 177 111 181 125 193" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round" opacity=".65"/>`,
			};
		case "resting":
		case "idle":
			return { behind: "", front: "" };
		default: {
			const exhaustive: never = behavior;
			return exhaustive;
		}
	}
}

function zzz(palette: PrototypePalette, deep: boolean): string {
	return `
		<g class="behavior-prop sleep-zzz" fill="${palette.outline}" font-family="ui-rounded, system-ui, sans-serif" font-weight="700">
			<text x="175" y="92" font-size="13">z</text>
			<text x="188" y="75" font-size="17">z</text>
			<text x="203" y="55" font-size="${deep ? 25 : 21}">z</text>
		</g>`;
}
