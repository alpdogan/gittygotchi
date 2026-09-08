import { GROWTH_THRESHOLDS } from "@gittygotchi/config";
import { describe, expect, it } from "vitest";
import type { ContributionDay, ContributionLevel } from "../src/contribution.ts";
import {
	countActiveDaysSinceAdoption,
	elapsedDaysSinceAdoption,
	growthPointsFor,
	neverDecreaseCount,
	resolveGrowthStage,
} from "../src/growth-engine.ts";
import { addUtcCalendarDays, isUtcWeekdayDate } from "../src/time.ts";

const now = new Date("2026-09-08T12:00:00.000Z");

function activeWeekdaysFrom(
	start: string,
	count: number,
	level: ContributionLevel = 1,
): ContributionDay[] {
	const days: ContributionDay[] = [];
	let cursor = start;
	while (days.length < count) {
		if (isUtcWeekdayDate(cursor)) {
			days.push({ date: cursor, level });
		}
		cursor = addUtcCalendarDays(cursor, 1);
	}
	return days;
}

describe("elapsed and active days", () => {
	it("counts calendar days since adoption, not GitHub account age", () => {
		expect(elapsedDaysSinceAdoption("2026-09-08T00:00:00.000Z", now)).toBe(0);
		expect(elapsedDaysSinceAdoption("2026-09-05T12:00:00.000Z", now)).toBe(3);
		expect(elapsedDaysSinceAdoption("2011-01-01T00:00:00.000Z", now)).toBeGreaterThan(365);
	});

	it("counts distinct post-adoption active days and ignores intensity spam", () => {
		const days: ContributionDay[] = [
			{ date: "2026-09-04", level: 4 },
			{ date: "2026-09-05", level: 4 },
			{ date: "2026-09-05", level: 4 },
			{ date: "2026-09-07", level: 1 },
			{ date: "2026-09-09", level: 4 },
		];
		expect(countActiveDaysSinceAdoption(days, "2026-09-05T00:00:00.000Z", now)).toBe(2);
	});

	it("ignores contribution history from before adoption", () => {
		const days = activeWeekdaysFrom("2026-01-01", 80);
		expect(countActiveDaysSinceAdoption(days, "2026-09-08T00:00:00.000Z", now)).toBe(0);
	});
});

describe("resolveGrowthStage", () => {
	it("requires both elapsed time and active days to leave the egg", () => {
		expect(resolveGrowthStage({ current: "egg", elapsedDays: 30, activeDays: 1 })).toBe("egg");
		expect(resolveGrowthStage({ current: "egg", elapsedDays: 2, activeDays: 20 })).toBe("egg");
		expect(resolveGrowthStage({ current: "egg", elapsedDays: 3, activeDays: 2 })).toBe("hatchling");
	});

	it("uses the centralized thresholds for later stages", () => {
		expect(
			resolveGrowthStage({
				current: "egg",
				elapsedDays: GROWTH_THRESHOLDS.baby.minElapsedDays,
				activeDays: GROWTH_THRESHOLDS.baby.minActiveDays,
			}),
		).toBe("baby");
		expect(
			resolveGrowthStage({
				current: "egg",
				elapsedDays: GROWTH_THRESHOLDS.mature.minElapsedDays,
				activeDays: GROWTH_THRESHOLDS.mature.minActiveDays,
			}),
		).toBe("mature");
	});

	it("never decreases the stored growth stage", () => {
		expect(resolveGrowthStage({ current: "adult", elapsedDays: 0, activeDays: 0 })).toBe("adult");
	});

	it("never decreases stored active-day or growth-point counters", () => {
		expect(neverDecreaseCount(50, 8)).toBe(50);
		expect(growthPointsFor(3, 2)).toBe(3_002);
		expect(neverDecreaseCount(9_000, growthPointsFor(3, 2))).toBe(9_000);
	});
});
