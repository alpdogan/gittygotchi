import type {
	Behavior,
	GittyClass,
	GrowthStage,
	Hunger,
	Mood,
	VisiblePetState,
} from "@gittygotchi/domain";
import {
	BEHAVIOR_STATES,
	GITTY_CLASSES,
	GROWTH_STAGES,
	HUNGER_STATES,
	MOOD_STATES,
} from "@gittygotchi/domain";
import { renderGitty } from "./renderer.ts";

export const SCREENSHOT_STAGES: GrowthStage[] = [...GROWTH_STAGES];
export const SCREENSHOT_CLASSES: GittyClass[] = [...GITTY_CLASSES];
export const SCREENSHOT_MOODS: Mood[] = [...MOOD_STATES];
export const SCREENSHOT_HUNGERS: Hunger[] = [...HUNGER_STATES];
export const SCREENSHOT_BEHAVIORS: Behavior[] = [...BEHAVIOR_STATES];

const SAMPLE_USERNAME = "alpdogan";

export function screenshotState(overrides: Partial<VisiblePetState> = {}): VisiblePetState {
	return {
		gittyClass: "earth",
		growthStage: "adult",
		hunger: "normal",
		mood: "happy",
		behavior: "idle",
		...overrides,
	};
}

export function renderScreenshot(overrides: Partial<VisiblePetState> = {}): string {
	return renderGitty({
		username: SAMPLE_USERNAME,
		state: screenshotState(overrides),
	});
}

export function stageSample(growthStage: GrowthStage): VisiblePetState {
	return screenshotState({
		growthStage,
		mood: growthStage === "egg" ? "neutral" : "happy",
	});
}

export function classSample(gittyClass: GittyClass): VisiblePetState {
	return screenshotState({ gittyClass });
}

export function moodSample(mood: Mood): VisiblePetState {
	return screenshotState({ mood });
}

export function hungerSample(hunger: Hunger): VisiblePetState {
	return screenshotState({ hunger, mood: "neutral" });
}

export function behaviorSample(behavior: Behavior): VisiblePetState {
	return screenshotState({ behavior });
}

export function stageClassSample(
	growthStage: GrowthStage,
	gittyClass: GittyClass,
): VisiblePetState {
	return screenshotState({
		growthStage,
		gittyClass,
		mood: growthStage === "egg" ? "neutral" : "happy",
	});
}

export function renderStageScreenshot(growthStage: GrowthStage): string {
	return renderScreenshot(stageSample(growthStage));
}

export function renderClassScreenshot(gittyClass: GittyClass): string {
	return renderScreenshot(classSample(gittyClass));
}

export function renderMoodScreenshot(mood: Mood): string {
	return renderScreenshot(moodSample(mood));
}

export function renderHungerScreenshot(hunger: Hunger): string {
	return renderScreenshot(hungerSample(hunger));
}

export function renderBehaviorScreenshot(behavior: Behavior): string {
	return renderScreenshot(behaviorSample(behavior));
}

export function renderStageClassScreenshot(
	growthStage: GrowthStage,
	gittyClass: GittyClass,
): string {
	return renderScreenshot(stageClassSample(growthStage, gittyClass));
}
