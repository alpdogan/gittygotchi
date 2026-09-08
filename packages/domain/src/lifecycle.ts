import {
	GRUMPY_INACTIVE_WEEKDAYS,
	HIBERNATION_INACTIVE_WEEKDAYS,
	HIGH_INTENSITY_LEVEL,
	LATE_EVENING_HOUR_END,
	LATE_EVENING_HOUR_START,
	MORNING_HOUR_END,
	MORNING_HOUR_START,
	NIGHT_HOUR_END,
	NIGHT_HOUR_START,
	SAD_INACTIVE_WEEKDAYS,
} from "@gittygotchi/config";
import { type ContributionDay, type ContributionLevel, utcCalendarDate } from "./contribution.ts";
import {
	countActiveDaysSinceAdoption,
	elapsedDaysSinceAdoption,
	growthPointsFor,
	neverDecreaseCount,
	resolveGrowthStage,
} from "./growth-engine.ts";
import type { PetLifecycle, PetSnapshot } from "./pet.ts";
import type { Behavior, Hunger, Mood } from "./state.ts";
import { addUtcCalendarDays, isUtcWeekdayDate, utcClockParts } from "./time.ts";

function contributionByDate(days: readonly ContributionDay[]): Map<string, ContributionLevel> {
	const map = new Map<string, ContributionLevel>();
	for (const day of days) {
		map.set(day.date, day.level);
	}
	return map;
}

function isNightHour(hour: number): boolean {
	return hour >= NIGHT_HOUR_START || hour <= NIGHT_HOUR_END;
}

function isLateEveningHour(hour: number): boolean {
	return hour >= LATE_EVENING_HOUR_START && hour <= LATE_EVENING_HOUR_END;
}

function isMorningHour(hour: number): boolean {
	return hour >= MORNING_HOUR_START && hour <= MORNING_HOUR_END;
}

function isWeekendWeekday(weekday: number): boolean {
	return weekday === 0 || weekday === 6;
}

export function countInactiveWeekdays(input: {
	days: readonly ContributionDay[];
	bornAt: string;
	now: Date;
}): number {
	const today = utcCalendarDate(input.now);
	const bornDate = utcCalendarDate(new Date(input.bornAt));
	if (today <= bornDate) {
		return 0;
	}

	const levels = contributionByDate(input.days);
	let inactive = 0;
	let cursor = bornDate;

	while (cursor < today) {
		if (isUtcWeekdayDate(cursor) && (levels.get(cursor) ?? 0) === 0) {
			inactive += 1;
		}
		cursor = addUtcCalendarDays(cursor, 1);
	}

	return inactive;
}

function hungerFor(input: {
	activeToday: boolean;
	inactiveWeekdays: number;
	weekend: boolean;
	morning: boolean;
	hibernating: boolean;
}): Hunger {
	if (input.activeToday) {
		return "full";
	}
	if (input.hibernating) {
		return "normal";
	}
	if (input.weekend) {
		return "normal";
	}
	if (input.inactiveWeekdays >= GRUMPY_INACTIVE_WEEKDAYS) {
		return "very_hungry";
	}
	if (input.morning || input.inactiveWeekdays > 0) {
		return "hungry";
	}
	return "normal";
}

function moodFor(input: {
	activeToday: boolean;
	intensity: ContributionLevel;
	inactiveWeekdays: number;
	weekend: boolean;
	hibernating: boolean;
}): Mood {
	if (input.activeToday && input.intensity >= HIGH_INTENSITY_LEVEL) {
		return "excited";
	}
	if (input.activeToday) {
		return "happy";
	}
	if (input.hibernating) {
		return "sad";
	}
	if (input.weekend) {
		return "neutral";
	}
	if (input.inactiveWeekdays >= SAD_INACTIVE_WEEKDAYS) {
		return "sad";
	}
	if (input.inactiveWeekdays >= GRUMPY_INACTIVE_WEEKDAYS) {
		return "grumpy";
	}
	return "neutral";
}

function behaviorFor(input: {
	activeToday: boolean;
	firstActivityToday: boolean;
	intensity: ContributionLevel;
	hibernating: boolean;
	weekend: boolean;
	hour: number;
}): Behavior {
	if (input.hibernating) {
		return "hibernating";
	}
	if (isNightHour(input.hour)) {
		return "sleeping";
	}
	if (input.weekend) {
		return "resting";
	}
	if (isLateEveningHour(input.hour)) {
		return "sleepy";
	}
	if (input.firstActivityToday) {
		return "eating";
	}
	if (input.activeToday && input.intensity >= HIGH_INTENSITY_LEVEL) {
		return "playing";
	}
	if (input.activeToday) {
		return "idle";
	}
	return "idle";
}

export function calculatePetState(input: {
	pet: PetSnapshot;
	contributionDays: readonly ContributionDay[];
	now: Date;
}): PetLifecycle {
	const clock = utcClockParts(input.now);
	const levels = contributionByDate(input.contributionDays);
	const todayLevel = levels.get(clock.date) ?? 0;
	const activeToday = todayLevel > 0;
	const firstActivityToday = activeToday && input.pet.lastActiveDate !== clock.date;
	const inactiveWeekdays = countInactiveWeekdays({
		days: input.contributionDays,
		bornAt: input.pet.bornAt,
		now: input.now,
	});
	const hibernating = !activeToday && inactiveWeekdays >= HIBERNATION_INACTIVE_WEEKDAYS;
	const weekend = isWeekendWeekday(clock.weekday);
	const elapsedDays = elapsedDaysSinceAdoption(input.pet.bornAt, input.now);
	const computedActiveDays = countActiveDaysSinceAdoption(
		input.contributionDays,
		input.pet.bornAt,
		input.now,
	);
	const activeDays = neverDecreaseCount(input.pet.activeDays, computedActiveDays);
	const growthStage = resolveGrowthStage({
		current: input.pet.growthStage,
		elapsedDays,
		activeDays,
	});
	const lastActiveDate = activeToday ? clock.date : input.pet.lastActiveDate;
	const view = {
		gittyClass: input.pet.gittyClass,
		growthStage,
		hunger: hungerFor({
			activeToday,
			inactiveWeekdays,
			weekend,
			morning: isMorningHour(clock.hour),
			hibernating,
		}),
		mood: moodFor({
			activeToday,
			intensity: todayLevel,
			inactiveWeekdays,
			weekend,
			hibernating,
		}),
		behavior: behaviorFor({
			activeToday,
			firstActivityToday,
			intensity: todayLevel,
			hibernating,
			weekend,
			hour: clock.hour,
		}),
	};

	const lifecycle: PetLifecycle = {
		growthStage,
		growthPoints: neverDecreaseCount(
			input.pet.growthPoints,
			growthPointsFor(elapsedDays, activeDays),
		),
		activeDays,
		view,
	};

	if (lastActiveDate !== undefined) {
		lifecycle.lastActiveDate = lastActiveDate;
	}

	return lifecycle;
}
