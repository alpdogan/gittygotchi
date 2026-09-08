import { CLASS_ALGORITHM_VERSION, EQUAL_NORMAL_CLASSES } from "@gittygotchi/config";
import { describe, expect, it } from "vitest";
import { NORMAL_GITTY_CLASSES } from "../src/class.ts";
import {
	assignGittyClass,
	classFromUnitRoll,
	classSeed,
	digestToUnitInterval,
	psyProbabilityForAgeYears,
	unitRollFromSeed,
} from "../src/class-roll.ts";

const now = new Date("2026-09-08T12:00:00.000Z");

describe("age-weighted Psy probability", () => {
	it("uses inclusive upper bounds from the config table", () => {
		expect(psyProbabilityForAgeYears(0)).toBe(0.01);
		expect(psyProbabilityForAgeYears(2)).toBe(0.01);
		expect(psyProbabilityForAgeYears(2.0001)).toBe(0.03);
		expect(psyProbabilityForAgeYears(5)).toBe(0.03);
		expect(psyProbabilityForAgeYears(8)).toBe(0.05);
		expect(psyProbabilityForAgeYears(10)).toBe(0.08);
		expect(psyProbabilityForAgeYears(12)).toBe(0.12);
		expect(psyProbabilityForAgeYears(15)).toBe(0.12);
		expect(psyProbabilityForAgeYears(15.0001)).toBe(0.18);
		expect(psyProbabilityForAgeYears(50)).toBe(0.18);
	});

	it("never guarantees Psy from account age alone", () => {
		expect(classFromUnitRoll(0.18, 50)).not.toBe("psy");
		expect(classFromUnitRoll(0.179, 50)).toBe("psy");
	});
});

describe("classFromUnitRoll", () => {
	it("keeps Earth, Water, Air, and Fire as equal remainder classes", () => {
		expect(NORMAL_GITTY_CLASSES).toEqual(EQUAL_NORMAL_CLASSES);
		expect(EQUAL_NORMAL_CLASSES).toEqual(["earth", "water", "air", "fire"]);
	});

	it("maps a 12-year account onto the documented 12% Psy band", () => {
		expect(classFromUnitRoll(0, 12)).toBe("psy");
		expect(classFromUnitRoll(0.1199, 12)).toBe("psy");
		expect(classFromUnitRoll(0.12, 12)).toBe("earth");
	});

	it("splits the remaining 88% equally among the four normal classes", () => {
		expect(classFromUnitRoll(0.12 + 0.88 * 0.125, 12)).toBe("earth");
		expect(classFromUnitRoll(0.12 + 0.88 * 0.375, 12)).toBe("water");
		expect(classFromUnitRoll(0.12 + 0.88 * 0.625, 12)).toBe("air");
		expect(classFromUnitRoll(0.12 + 0.88 * 0.875, 12)).toBe("fire");
	});
});

describe("assignGittyClass", () => {
	it("hashes a versioned seed into a unit interval without Math.random", () => {
		const seed = classSeed("alpdogan", "2011-01-01T00:00:00.000Z");
		expect(seed).toBe("alpdogan2011-01-01T00:00:00.000Zgittygotchi-class-v1");
	});

	it("produces the same class for the same seed and adoption time", async () => {
		const input = {
			username: "alpdogan",
			githubCreatedAt: "2011-01-01T00:00:00.000Z",
			now,
		};
		const first = await assignGittyClass(input);
		const second = await assignGittyClass(input);
		expect(first).toEqual(second);
		expect(first.algorithmVersion).toBe(CLASS_ALGORITHM_VERSION);
		expect(first.roll).toBeGreaterThanOrEqual(0);
		expect(first.roll).toBeLessThan(1);
	});

	it("converts SHA-256 into a 53-bit unit interval", async () => {
		const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("gitty"));
		const roll = digestToUnitInterval(digest);
		expect(roll).toBeGreaterThanOrEqual(0);
		expect(roll).toBeLessThan(1);
		expect(await unitRollFromSeed("gitty")).toBe(roll);
	});
});
