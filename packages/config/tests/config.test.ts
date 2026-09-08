import { describe, expect, it } from "vitest";
import { EQUAL_NORMAL_CLASSES, PSY_PROBABILITY_BANDS, readmeSnippet } from "../src/index.ts";

describe("class probability table", () => {
	it("keeps Earth, Water, Air, and Fire as equal normal classes", () => {
		expect(EQUAL_NORMAL_CLASSES).toEqual(["earth", "water", "air", "fire"]);
	});

	it("never guarantees Psy from account age alone", () => {
		for (const band of PSY_PROBABILITY_BANDS) {
			expect(band.psyProbability).toBeGreaterThan(0);
			expect(band.psyProbability).toBeLessThan(1);
			const remaining = 1 - band.psyProbability;
			expect(remaining / EQUAL_NORMAL_CLASSES.length).toBeCloseTo(remaining / 4);
		}
	});
});

describe("readmeSnippet", () => {
	it("uses the clickable Markdown wrapper around the SVG", () => {
		expect(readmeSnippet("alpdogan")).toBe(
			"[![GittyGotchi](https://gittygotchi.alpdogan.co/alpdogan.svg)](https://gittygotchi.alpdogan.co/alpdogan)",
		);
	});
});
