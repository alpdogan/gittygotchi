import type { Behavior, GrowthStage, Hunger, Mood } from "@gittygotchi/domain";
import { compactSvg } from "../compact.ts";
import { escapeXml } from "../escape.ts";
import {
	renderAdultSilhouette,
	renderMatureSilhouette,
	renderStageAnatomy,
	renderUnrevealedEgg,
} from "./anatomy.ts";
import { PROTOTYPE_ANIMATIONS } from "./animations.ts";
import { renderBehaviorLayer } from "./behavior.ts";
import { AIR_TREATMENT } from "./classes/air.ts";
import { EARTH_TREATMENT } from "./classes/earth.ts";
import { FIRE_TREATMENT } from "./classes/fire.ts";
import { PSY_TREATMENT } from "./classes/psy.ts";
import { WATER_TREATMENT } from "./classes/water.ts";
import { renderPrototypeFace, resolvePrototypeExpression } from "./face.ts";
import type { ClassTreatment, PrototypeClass } from "./types.ts";

const TREATMENTS: Record<PrototypeClass, ClassTreatment> = {
	earth: EARTH_TREATMENT,
	water: WATER_TREATMENT,
	air: AIR_TREATMENT,
	fire: FIRE_TREATMENT,
	psy: PSY_TREATMENT,
};

export function renderClassPrototype(gittyClass: PrototypeClass): string {
	return renderVariationPrototype({ gittyClass });
}

export type PrototypeRenderOptions = {
	gittyClass: PrototypeClass;
	stage?: GrowthStage;
	mood?: Mood;
	hunger?: Hunger;
	behavior?: Behavior;
};

export function renderVariationPrototype(options: PrototypeRenderOptions): string {
	const {
		gittyClass,
		stage = "adult",
		mood = "happy",
		hunger = "normal",
		behavior = "idle",
	} = options;
	if (stage === "egg") {
		return renderEggPrototype();
	}

	const treatment = TREATMENTS[gittyClass];
	const label = `${gittyClass[0]?.toUpperCase()}${gittyClass.slice(1)}`;
	const expression = resolvePrototypeExpression(mood, hunger, behavior);
	const face = renderPrototypeFace(expression, treatment.palette);
	const behaviorLayer = renderBehaviorLayer(behavior, treatment.palette);
	const classEffects = renderClassEffects(stage, treatment);

	return compactSvg(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img" data-prototype-class="${gittyClass}" data-prototype-stage="${stage}" data-prototype-mood="${mood}" data-prototype-hunger="${hunger}" data-prototype-behavior="${behavior}" data-prototype-expression="${expression}" data-class-effect-level="${classEffects.level}">
	<title>${escapeXml(label)} Gitty ${escapeXml(stage)} ${escapeXml(expression)} prototype</title>
	<desc>${escapeXml(stage)} ${escapeXml(expression)} ${escapeXml(gittyClass)} Gitty visual prototype with stage-aware class treatment.</desc>
	<style>
		${PROTOTYPE_ANIMATIONS}
		${treatment.styles}
	</style>
	<rect x="2" y="2" width="236" height="236" rx="27" fill="#fbf7ee" stroke="#d8cdbb" stroke-width="3"/>
	<g class="class-${gittyClass} behavior-${behavior}">
		${classEffects.behind}
		${behaviorLayer.behind}
		<ellipse class="gitty-shadow" cx="128" cy="215" rx="52" ry="9" fill="#ad9e88" opacity=".34"/>
		${renderStageAnatomy(stage, treatment, face)}
		${behaviorLayer.front}
		${classEffects.front}
	</g>
</svg>`);
}

function renderClassEffects(
	stage: Exclude<GrowthStage, "egg">,
	treatment: ClassTreatment,
): { level: "none" | "adult" | "mature"; behind: string; front: string } {
	if (stage !== "adult" && stage !== "mature") {
		return { level: "none", behind: "", front: "" };
	}

	const adultBehind = `<g data-effect-tier="adult">${treatment.adultEffects.behind}</g>`;
	const adultFront = `<g data-effect-tier="adult">${treatment.adultEffects.front}</g>`;
	if (stage === "adult") {
		return { level: "adult", behind: adultBehind, front: adultFront };
	}

	return {
		level: "mature",
		behind: `${adultBehind}<g data-effect-tier="mature">${treatment.matureEffects.behind}</g>`,
		front: `${adultFront}<g data-effect-tier="mature">${treatment.matureEffects.front}</g>`,
	};
}

function renderEggPrototype(): string {
	return compactSvg(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img" data-prototype-class="unrevealed" data-prototype-stage="egg">
	<title>Unrevealed Gitty egg prototype</title>
	<desc>Neutral unrevealed Gitty egg with generic species shell motifs.</desc>
	<rect x="2" y="2" width="236" height="236" rx="27" fill="#fbf7ee" stroke="#d8cdbb" stroke-width="3"/>
	<ellipse class="gitty-shadow" cx="128" cy="215" rx="52" ry="9" fill="#ad9e88" opacity=".34"/>
	${renderUnrevealedEgg()}
</svg>`);
}

export function renderPrototypeSilhouette(): string {
	return renderPrototypeStageSilhouette("adult");
}

export function renderPrototypeMatureSilhouette(): string {
	return renderPrototypeStageSilhouette("mature");
}

function renderPrototypeStageSilhouette(stage: "adult" | "mature"): string {
	const silhouette = stage === "adult" ? renderAdultSilhouette() : renderMatureSilhouette();
	const title =
		stage === "adult" ? "Gitty silhouette prototype" : "Gitty mature silhouette prototype";
	return compactSvg(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img" data-prototype-stage="${stage}">
	<title>${title}</title>
	<desc>Black silhouette of the shared ${stage} Gitty anatomy.</desc>
	<rect x="2" y="2" width="236" height="236" rx="27" fill="#fbf7ee" stroke="#d8cdbb" stroke-width="3"/>
	${silhouette}
</svg>`);
}
