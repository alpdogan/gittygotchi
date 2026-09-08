import { describe, expect, it } from "vitest";
import {
	excludeFutureContributionDays,
	isContributionLevel,
	isIsoCalendarDate,
	utcCalendarDate,
} from "../src/contribution.ts";

describe("contribution dates", () => {
	it("accepts real calendar dates and rejects impossible ones", () => {
		expect(isIsoCalendarDate("2026-09-08")).toBe(true);
		expect(isIsoCalendarDate("2026-02-29")).toBe(false);
		expect(isIsoCalendarDate("2026-13-01")).toBe(false);
		expect(isIsoCalendarDate("09-08-2026")).toBe(false);
	});

	it("treats only 0-4 as contribution levels", () => {
		expect(isContributionLevel(0)).toBe(true);
		expect(isContributionLevel(4)).toBe(true);
		expect(isContributionLevel(5)).toBe(false);
		expect(isContributionLevel(-1)).toBe(false);
	});

	it("ignores dates after today and keeps today", () => {
		const days = [
			{ date: "2026-09-07", level: 1 as const },
			{ date: "2026-09-08", level: 2 as const },
			{ date: "2026-09-09", level: 0 as const },
		];

		expect(excludeFutureContributionDays(days, "2026-09-08")).toEqual([
			{ date: "2026-09-07", level: 1 },
			{ date: "2026-09-08", level: 2 },
		]);
	});

	it("formats injected time as a UTC calendar date", () => {
		expect(utcCalendarDate(new Date("2026-09-08T23:30:00.000Z"))).toBe("2026-09-08");
	});
});
