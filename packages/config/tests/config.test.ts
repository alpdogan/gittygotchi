import { describe, expect, it } from "vitest";
import {
	CONTRIBUTION_FRESHNESS_TTL_SECONDS,
	EQUAL_NORMAL_CLASSES,
	GROWTH_THRESHOLDS,
	isContributionFresh,
	NOT_FOUND_SVG_CACHE_TTL_SECONDS,
	PSY_PROBABILITY_BANDS,
	readmeSnippet,
	SVG_CACHE_TTL_SECONDS,
} from "../src/index.ts";

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

describe("growth thresholds", () => {
	it("requires both elapsed days and distinct active days, strictly increasing", () => {
		const ordered = [
			GROWTH_THRESHOLDS.egg,
			GROWTH_THRESHOLDS.hatchling,
			GROWTH_THRESHOLDS.baby,
			GROWTH_THRESHOLDS.young,
			GROWTH_THRESHOLDS.adult,
			GROWTH_THRESHOLDS.mature,
		];
		for (let index = 1; index < ordered.length; index += 1) {
			const previous = ordered[index - 1];
			const current = ordered[index];
			if (previous === undefined || current === undefined) {
				throw new Error("growth threshold table is incomplete");
			}
			expect(current.minElapsedDays).toBeGreaterThan(previous.minElapsedDays);
			expect(current.minActiveDays).toBeGreaterThan(previous.minActiveDays);
		}
	});
});

describe("cache TTLs", () => {
	it("keeps SVG cache shorter than contribution freshness", () => {
		expect(SVG_CACHE_TTL_SECONDS).toBe(10 * 60);
		expect(CONTRIBUTION_FRESHNESS_TTL_SECONDS).toBe(20 * 60);
		expect(NOT_FOUND_SVG_CACHE_TTL_SECONDS).toBe(60);
		expect(SVG_CACHE_TTL_SECONDS).toBeLessThan(CONTRIBUTION_FRESHNESS_TTL_SECONDS);
	});
});

describe("isContributionFresh", () => {
	const now = new Date("2026-09-08T12:00:00.000Z");

	it("skips GitHub when the last sync is inside the freshness window", () => {
		expect(isContributionFresh("2026-09-08T11:41:00.000Z", now)).toBe(true);
	});

	it("refetches when the last sync is missing, invalid, or expired", () => {
		expect(isContributionFresh(undefined, now)).toBe(false);
		expect(isContributionFresh("not-a-date", now)).toBe(false);
		expect(isContributionFresh("2026-09-08T11:39:59.000Z", now)).toBe(false);
	});
});

describe("readmeSnippet", () => {
	it("uses the clickable Markdown wrapper around the SVG", () => {
		expect(readmeSnippet("alpdogan")).toBe(
			"[![GittyGotchi](https://gittygotchi.alpdogan.co/alpdogan.svg)](https://gittygotchi.alpdogan.co/alpdogan)",
		);
	});
});
