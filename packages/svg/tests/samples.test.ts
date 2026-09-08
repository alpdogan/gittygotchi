import {
	BEHAVIOR_STATES,
	GITTY_CLASSES,
	GROWTH_STAGES,
	HUNGER_STATES,
	MOOD_STATES,
} from "@gittygotchi/domain";
import { describe, expect, it } from "vitest";
import {
	renderBehaviorScreenshot,
	renderClassScreenshot,
	renderHungerScreenshot,
	renderMoodScreenshot,
	renderStageClassScreenshot,
	renderStageScreenshot,
	SCREENSHOT_BEHAVIORS,
	SCREENSHOT_CLASSES,
	SCREENSHOT_HUNGERS,
	SCREENSHOT_MOODS,
	SCREENSHOT_STAGES,
} from "../src/samples.ts";

describe("screenshot samples", () => {
	it("covers every visible domain state", () => {
		expect(SCREENSHOT_STAGES).toEqual([...GROWTH_STAGES]);
		expect(SCREENSHOT_CLASSES).toEqual([...GITTY_CLASSES]);
		expect(SCREENSHOT_MOODS).toEqual([...MOOD_STATES]);
		expect(SCREENSHOT_HUNGERS).toEqual([...HUNGER_STATES]);
		expect(SCREENSHOT_BEHAVIORS).toEqual([...BEHAVIOR_STATES]);
	});

	it("renders a dedicated SVG for each state axis", () => {
		for (const stage of SCREENSHOT_STAGES) {
			const svg = renderStageScreenshot(stage);
			expect(svg).toContain(`data-gitty-body="${stage}"`);
		}

		for (const gittyClass of SCREENSHOT_CLASSES) {
			const svg = renderClassScreenshot(gittyClass);
			expect(svg).toContain(`data-gitty-class="${gittyClass}"`);
			expect(svg).toContain('data-gitty-body="adult"');
		}

		for (const mood of SCREENSHOT_MOODS) {
			expect(renderMoodScreenshot(mood)).toContain("<svg");
		}

		for (const hunger of SCREENSHOT_HUNGERS) {
			expect(renderHungerScreenshot(hunger)).toContain("<svg");
		}

		for (const behavior of SCREENSHOT_BEHAVIORS) {
			expect(renderBehaviorScreenshot(behavior)).toContain(`behavior-${behavior}`);
		}

		expect(renderStageClassScreenshot("egg", "water")).toContain('data-gitty-class="water"');
		expect(renderStageClassScreenshot("egg", "water")).toContain('data-gitty-body="egg"');
	});
});
