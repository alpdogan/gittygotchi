import type { VisiblePetState } from "@gittygotchi/domain";
import { GITTY_STYLE } from "./animations.ts";
import { motionClass, renderBehaviorExtras } from "./behavior.ts";
import { bodyScale, renderBody, renderGroundShadow } from "./body.ts";
import { CARD_FILL, CARD_STROKE } from "./card.ts";
import { renderClassEffects } from "./class-effects.ts";
import { compactSvg } from "./compact.ts";
import { escapeXml } from "./escape.ts";
import { renderFace, resolveFace } from "./face.ts";
import { CLASS_PALETTES } from "./palette.ts";

export const FOUNDATION_PREVIEW_STATE: VisiblePetState = {
	gittyClass: "earth",
	growthStage: "egg",
	hunger: "normal",
	mood: "neutral",
	behavior: "idle",
};

export type GittySvgOptions = {
	username: string;
	state: VisiblePetState;
	preview?: boolean;
};

export function renderGitty(options: GittySvgOptions): string {
	const { username, state } = options;
	const palette = CLASS_PALETTES[state.gittyClass];
	const face = resolveFace(state);
	const scale = bodyScale(state.growthStage);
	const safeUser = escapeXml(username);
	const title = options.preview
		? `GittyGotchi preview for @${safeUser}`
		: `GittyGotchi for @${safeUser}`;
	const desc = options.preview
		? "A preview egg. Live class and growth are not connected yet."
		: `${escapeXml(state.gittyClass)} ${escapeXml(state.growthStage)} looking ${escapeXml(face)}.`;

	return compactSvg(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img" data-gitty-class="${state.gittyClass}" data-gitty-stage="${state.growthStage}" data-gitty-behavior="${state.behavior}" data-gitty-face="${face}">
	<title>${title}</title>
	<desc>${desc}</desc>
	${GITTY_STYLE}
	<rect width="240" height="240" rx="28" fill="${CARD_FILL}" stroke="${CARD_STROKE}" stroke-width="3"/>
	<g transform="translate(120 150) scale(${scale}) translate(-120 -150)">
		${renderGroundShadow(state.growthStage, palette, state.behavior)}
		<g class="${motionClass(state.behavior)}">
			${renderBody(state.growthStage, palette, state.gittyClass)}
			${renderClassEffects(state.gittyClass, palette, state.growthStage)}
			${renderFace(face, palette, state.growthStage)}
			${renderBehaviorExtras(state.behavior, palette)}
		</g>
	</g>
</svg>
`);
}
