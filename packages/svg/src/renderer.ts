import type { VisiblePetState } from "@gittygotchi/domain";
import { escapeXml } from "./escape.ts";
import { resolveFace } from "./face.ts";
import { renderVariationPrototype } from "./prototype/renderer.ts";

export const FOUNDATION_PREVIEW_STATE: VisiblePetState = {
	gittyClass: "earth",
	growthStage: "adult",
	hunger: "normal",
	mood: "happy",
	behavior: "idle",
};

export const PREVIEW_EGG_STATE: VisiblePetState = {
	gittyClass: "earth",
	growthStage: "egg",
	hunger: "normal",
	mood: "happy",
	behavior: "idle",
};

export type GittySvgOptions = {
	username: string;
	state: VisiblePetState;
	preview?: boolean;
};

export function renderGitty(options: GittySvgOptions): string {
	const { username, state } = options;
	const face = resolveFace(state);
	const safeUser = escapeXml(username);
	const title = options.preview
		? `GittyGotchi preview for @${safeUser}`
		: `GittyGotchi for @${safeUser}`;
	const desc = options.preview
		? "A preview adult Gitty. Live class and growth are not connected yet."
		: `${escapeXml(state.gittyClass)} ${escapeXml(state.growthStage)} looking ${escapeXml(face)}.`;

	return stampProductionMetadata(
		renderVariationPrototype({
			gittyClass: state.gittyClass,
			stage: state.growthStage,
			mood: state.mood,
			hunger: state.hunger,
			behavior: state.behavior,
		}),
		{
			title,
			desc,
			gittyClass: state.gittyClass,
			growthStage: state.growthStage,
			behavior: state.behavior,
			face,
		},
	);
}

function stampProductionMetadata(
	svg: string,
	attrs: {
		title: string;
		desc: string;
		gittyClass: string;
		growthStage: string;
		behavior: string;
		face: string;
	},
): string {
	return svg
		.replace(/<title>[\s\S]*?<\/title>/, `<title>${attrs.title}</title>`)
		.replace(/<desc>[\s\S]*?<\/desc>/, `<desc>${attrs.desc}</desc>`)
		.replace(
			/<svg\b([^>]*)>/,
			`<svg$1 data-gitty-class="${attrs.gittyClass}" data-gitty-stage="${attrs.growthStage}" data-gitty-body="${attrs.growthStage}" data-gitty-behavior="${attrs.behavior}" data-gitty-face="${attrs.face}">`,
		);
}
