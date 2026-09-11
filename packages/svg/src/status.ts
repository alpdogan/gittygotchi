import type { Behavior, GrowthStage, VisiblePetState } from "@gittygotchi/domain";
import { compactSvg } from "./compact.ts";
import { escapeXml } from "./escape.ts";

export type PetStatusFact = {
	label: string;
	value: string;
};

export function titleCaseStatus(value: string): string {
	return value
		.split("_")
		.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
		.join(" ");
}

export function sleepStatus(behavior: Behavior): string {
	if (behavior === "sleeping" || behavior === "sleepy" || behavior === "hibernating") {
		return titleCaseStatus(behavior);
	}
	return "Awake";
}

export function classStatus(state: Pick<VisiblePetState, "gittyClass" | "growthStage">): string {
	return state.growthStage === "egg" ? "Hidden" : titleCaseStatus(state.gittyClass);
}

export function sharePageFacts(state: VisiblePetState): PetStatusFact[] {
	const facts: PetStatusFact[] = [
		{ label: "Class", value: classStatus(state) },
		{ label: "Stage", value: titleCaseStatus(state.growthStage) },
	];
	if (state.growthStage === "egg") {
		return facts;
	}
	return [
		...facts,
		{ label: "Hunger", value: titleCaseStatus(state.hunger) },
		{ label: "Mood", value: titleCaseStatus(state.mood) },
		{ label: "Sleep", value: sleepStatus(state.behavior) },
	];
}

export function readmeStatusFacts(
	growthStage: GrowthStage,
	state: VisiblePetState,
): PetStatusFact[] {
	if (growthStage === "egg") {
		return [];
	}
	return [
		{ label: "Hunger", value: titleCaseStatus(state.hunger) },
		{ label: "Mood", value: titleCaseStatus(state.mood) },
		{ label: "Sleep", value: sleepStatus(state.behavior) },
	];
}

export function renderReadmeStatusOverlay(state: VisiblePetState): string {
	const facts = readmeStatusFacts(state.growthStage, state);
	if (facts.length === 0) {
		return "";
	}

	const columns = facts
		.map((fact, index) => {
			const x = 49 + index * 71;
			return `<text x="${x}" y="216" text-anchor="middle" fill="#8a7a68" font-family="ui-rounded, system-ui, sans-serif" font-size="8" font-weight="700">${escapeXml(fact.label)}</text><text x="${x}" y="228" text-anchor="middle" fill="#3d2f24" font-family="ui-rounded, system-ui, sans-serif" font-size="10" font-weight="700">${escapeXml(fact.value)}</text>`;
		})
		.join("");

	return compactSvg(`<g class="gitty-status-labels" data-gitty-status-labels="hunger mood sleep">
		<rect x="14" y="205" width="212" height="27" rx="10" fill="#f3ead7"/>
		${columns}
	</g>`);
}
