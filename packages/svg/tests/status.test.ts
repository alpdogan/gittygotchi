import { describe, expect, it } from "vitest";
import { FOUNDATION_PREVIEW_STATE } from "../src/renderer.ts";
import { readmeStatusFacts, sharePageFacts, sleepStatus } from "../src/status.ts";

describe("share page facts", () => {
	it("omits hunger, mood, and sleep on eggs", () => {
		expect(sharePageFacts(FOUNDATION_PREVIEW_STATE)).toEqual([
			{ label: "Class", value: "Hidden" },
			{ label: "Stage", value: "Egg" },
		]);
		expect(readmeStatusFacts("egg", FOUNDATION_PREVIEW_STATE)).toEqual([]);
	});

	it("includes hunger, mood, and sleep after the egg", () => {
		expect(
			sharePageFacts({
				gittyClass: "water",
				growthStage: "adult",
				hunger: "hungry",
				mood: "happy",
				behavior: "sleeping",
			}),
		).toEqual([
			{ label: "Class", value: "Water" },
			{ label: "Stage", value: "Adult" },
			{ label: "Hunger", value: "Hungry" },
			{ label: "Mood", value: "Happy" },
			{ label: "Sleep", value: "Sleeping" },
		]);
	});

	it("treats idle and active days as awake", () => {
		expect(sleepStatus("idle")).toBe("Awake");
		expect(sleepStatus("eating")).toBe("Awake");
		expect(sleepStatus("playing")).toBe("Awake");
		expect(sleepStatus("resting")).toBe("Awake");
		expect(sleepStatus("sleepy")).toBe("Sleepy");
	});
});
