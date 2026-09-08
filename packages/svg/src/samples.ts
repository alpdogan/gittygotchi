import type { GittyClass, GrowthStage, VisiblePetState } from "@gittygotchi/domain";
import { GITTY_CLASSES, GROWTH_STAGES } from "@gittygotchi/domain";
import { renderGitty } from "./renderer.ts";

export const SCREENSHOT_STAGES: GrowthStage[] = [...GROWTH_STAGES];
export const SCREENSHOT_CLASSES: GittyClass[] = [...GITTY_CLASSES];

export function stageSample(growthStage: GrowthStage): VisiblePetState {
	return {
		gittyClass: "earth",
		growthStage,
		hunger: "normal",
		mood: growthStage === "egg" ? "neutral" : "happy",
		behavior: "idle",
	};
}

export function classSample(gittyClass: GittyClass): VisiblePetState {
	return {
		gittyClass,
		growthStage: "adult",
		hunger: "normal",
		mood: "happy",
		behavior: "idle",
	};
}

export function renderStageScreenshot(growthStage: GrowthStage): string {
	return renderGitty({
		username: "alpdogan",
		state: stageSample(growthStage),
	});
}

export function renderClassScreenshot(gittyClass: GittyClass): string {
	return renderGitty({
		username: "alpdogan",
		state: classSample(gittyClass),
	});
}
