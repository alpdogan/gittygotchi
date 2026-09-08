import { GROWTH_THRESHOLDS } from "@gittygotchi/config";
import { type ContributionDay, utcCalendarDate } from "./contribution.ts";
import { GROWTH_STAGES, type GrowthStage } from "./growth.ts";
import { calendarDaysBetween } from "./time.ts";

export function elapsedDaysSinceAdoption(bornAt: string, now: Date): number {
	return Math.max(0, calendarDaysBetween(utcCalendarDate(new Date(bornAt)), utcCalendarDate(now)));
}

export function countActiveDaysSinceAdoption(
	days: readonly ContributionDay[],
	bornAt: string,
	now: Date,
): number {
	const bornDate = utcCalendarDate(new Date(bornAt));
	const today = utcCalendarDate(now);
	const seen = new Set<string>();

	for (const day of days) {
		if (day.level === 0 || day.date < bornDate || day.date > today) {
			continue;
		}
		seen.add(day.date);
	}

	return seen.size;
}

export function growthPointsFor(elapsedDays: number, activeDays: number): number {
	return elapsedDays * 1_000 + activeDays;
}

export function resolveGrowthStage(input: {
	current: GrowthStage;
	elapsedDays: number;
	activeDays: number;
}): GrowthStage {
	let qualified: GrowthStage = "egg";

	for (const stage of GROWTH_STAGES) {
		const threshold = GROWTH_THRESHOLDS[stage];
		if (
			input.elapsedDays >= threshold.minElapsedDays &&
			input.activeDays >= threshold.minActiveDays
		) {
			qualified = stage;
		}
	}

	return laterGrowthStage(input.current, qualified);
}

export function laterGrowthStage(current: GrowthStage, next: GrowthStage): GrowthStage {
	return GROWTH_STAGES.indexOf(next) < GROWTH_STAGES.indexOf(current) ? current : next;
}

export function neverDecreaseCount(stored: number, computed: number): number {
	return Math.max(stored, computed);
}
