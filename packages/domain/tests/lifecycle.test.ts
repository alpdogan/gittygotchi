import { describe, expect, it } from "vitest";
import type { ContributionDay } from "../src/contribution.ts";
import { calculatePetState, countInactiveWeekdays } from "../src/lifecycle.ts";
import type { PetSnapshot } from "../src/pet.ts";
import { addUtcCalendarDays, isUtcWeekend, utcClockParts } from "../src/time.ts";

const weekdayNoon = new Date("2026-09-08T12:00:00.000Z");
const weekdayMorning = new Date("2026-09-08T08:00:00.000Z");
const lateEvening = new Date("2026-09-08T21:00:00.000Z");
const night = new Date("2026-09-08T23:30:00.000Z");
const saturday = new Date("2026-09-12T12:00:00.000Z");
const mondayAfterWeekend = new Date("2026-09-14T08:00:00.000Z");

function pet(overrides: Partial<PetSnapshot> = {}): PetSnapshot {
	return {
		username: "alpdogan",
		gittyClass: "earth",
		classAlgorithmVersion: "v1",
		githubCreatedAt: "2011-01-01T00:00:00.000Z",
		bornAt: "2026-09-01T00:00:00.000Z",
		growthStage: "egg",
		growthPoints: 0,
		activeDays: 0,
		...overrides,
	};
}

function day(date: string, level: 0 | 1 | 2 | 3 | 4): ContributionDay {
	return { date, level };
}

describe("utc time isolation", () => {
	it("reads date, hour, and weekday from injected UTC time", () => {
		expect(utcClockParts(weekdayNoon)).toEqual({ date: "2026-09-08", hour: 12, weekday: 2 });
		expect(isUtcWeekend(saturday)).toBe(true);
		expect(isUtcWeekend(weekdayNoon)).toBe(false);
	});
});

describe("hunger, mood, and behavior", () => {
	it("is hungry on a weekday morning with no contribution today", () => {
		const state = calculatePetState({
			pet: pet({ bornAt: "2026-09-08T00:00:00.000Z" }),
			contributionDays: [],
			now: weekdayMorning,
		});
		expect(state.view.hunger).toBe("hungry");
		expect(state.view.mood).toBe("neutral");
		expect(state.view.behavior).toBe("idle");
	});

	it("eats on the first detected activity of the day", () => {
		const state = calculatePetState({
			pet: pet({ lastActiveDate: "2026-09-07" }),
			contributionDays: [day("2026-09-08", 1)],
			now: weekdayNoon,
		});
		expect(state.view.hunger).toBe("full");
		expect(state.view.mood).toBe("happy");
		expect(state.view.behavior).toBe("eating");
		expect(state.lastActiveDate).toBe("2026-09-08");
	});

	it("becomes excited and plays after high-intensity activity already seen today", () => {
		const state = calculatePetState({
			pet: pet({ lastActiveDate: "2026-09-08" }),
			contributionDays: [day("2026-09-08", 4)],
			now: weekdayNoon,
		});
		expect(state.view.mood).toBe("excited");
		expect(state.view.behavior).toBe("playing");
	});

	it("sleeps at night and gets sleepy in the late evening", () => {
		expect(
			calculatePetState({
				pet: pet(),
				contributionDays: [],
				now: night,
			}).view.behavior,
		).toBe("sleeping");
		expect(
			calculatePetState({
				pet: pet(),
				contributionDays: [],
				now: lateEvening,
			}).view.behavior,
		).toBe("sleepy");
	});

	it("rests on Saturday without treating the weekend as neglect", () => {
		const bornAt = "2026-09-11T00:00:00.000Z";
		const inactive = countInactiveWeekdays({
			days: [],
			bornAt,
			now: mondayAfterWeekend,
		});
		expect(inactive).toBe(1);
		const saturdayState = calculatePetState({
			pet: pet({ bornAt }),
			contributionDays: [],
			now: saturday,
		});
		expect(saturdayState.view.behavior).toBe("resting");
		expect(saturdayState.view.hunger).toBe("normal");
		expect(saturdayState.view.mood).toBe("neutral");
	});

	it("turns grumpy, then sad, then hibernates after inactive weekdays", () => {
		const bornAt = "2026-08-24T00:00:00.000Z";
		const grumpyNow = new Date("2026-08-27T12:00:00.000Z");
		expect(countInactiveWeekdays({ days: [], bornAt, now: grumpyNow })).toBe(3);
		expect(
			calculatePetState({ pet: pet({ bornAt }), contributionDays: [], now: grumpyNow }).view,
		).toMatchObject({ mood: "grumpy", hunger: "very_hungry" });

		const sadNow = new Date("2026-09-01T12:00:00.000Z");
		expect(countInactiveWeekdays({ days: [], bornAt, now: sadNow })).toBeGreaterThanOrEqual(6);
		expect(
			calculatePetState({ pet: pet({ bornAt }), contributionDays: [], now: sadNow }).view.mood,
		).toBe("sad");

		const hibernating = calculatePetState({
			pet: pet({ bornAt }),
			contributionDays: [],
			now: weekdayNoon,
		});
		expect(countInactiveWeekdays({ days: [], bornAt, now: weekdayNoon })).toBeGreaterThanOrEqual(
			10,
		);
		expect(hibernating.view.behavior).toBe("hibernating");
		expect(hibernating.view.mood).toBe("sad");
		expect(hibernating.view.hunger).toBe("normal");
	});

	it("wakes, eats, and continues growth when activity returns after hibernation", () => {
		const bornAt = "2026-08-01T00:00:00.000Z";
		const stored = pet({
			bornAt,
			gittyClass: "water",
			growthStage: "hatchling",
			growthPoints: 8_000,
			activeDays: 2,
		});
		const asleep = calculatePetState({
			pet: stored,
			contributionDays: [],
			now: weekdayNoon,
		});
		expect(asleep.view.behavior).toBe("hibernating");
		expect(asleep.growthStage).toBe("hatchling");

		const awake = calculatePetState({
			pet: { ...stored, lastActiveDate: "2026-08-20" },
			contributionDays: [day("2026-09-08", 2)],
			now: weekdayNoon,
		});
		expect(awake.view.behavior).toBe("eating");
		expect(awake.view.mood).toBe("happy");
		expect(awake.view.gittyClass).toBe("water");
		expect(awake.growthStage).toBe("hatchling");
		expect(awake.activeDays).toBeGreaterThanOrEqual(2);
	});
});

describe("invariants", () => {
	it("never introduces a death state", () => {
		const state = calculatePetState({
			pet: pet({ bornAt: "2020-01-01T00:00:00.000Z" }),
			contributionDays: [],
			now: weekdayNoon,
		});
		expect(state.view.behavior).toBe("hibernating");
		expect(state.view.behavior).not.toBe("dead");
	});

	it("keeps class unchanged after adoption", () => {
		const state = calculatePetState({
			pet: pet({ gittyClass: "psy" }),
			contributionDays: [day("2026-09-08", 4)],
			now: weekdayNoon,
		});
		expect(state.view.gittyClass).toBe("psy");
	});

	it("is deterministic for the same pet, time, and contributions", () => {
		const input = {
			pet: pet({ lastActiveDate: "2026-09-07" }),
			contributionDays: [day("2026-09-08", 3)],
			now: weekdayNoon,
		};
		expect(calculatePetState(input)).toEqual(calculatePetState(input));
	});

	it("ignores future contribution dates for activity and inactivity", () => {
		const bornAt = "2026-09-07T00:00:00.000Z";
		const days = [day("2026-09-09", 4), day("2026-09-10", 0)];
		expect(countInactiveWeekdays({ days, bornAt, now: weekdayNoon })).toBe(1);
		const state = calculatePetState({
			pet: pet({ bornAt }),
			contributionDays: days,
			now: weekdayNoon,
		});
		expect(state.activeDays).toBe(0);
		expect(state.view.behavior).not.toBe("eating");
	});

	it("does not let weekend zeros push a one-weekday gap into punishment", () => {
		const bornAt = "2026-09-11T00:00:00.000Z";
		expect(
			countInactiveWeekdays({
				days: [day("2026-09-12", 0), day("2026-09-13", 0)],
				bornAt,
				now: mondayAfterWeekend,
			}),
		).toBe(1);
		const state = calculatePetState({
			pet: pet({ bornAt }),
			contributionDays: [],
			now: mondayAfterWeekend,
		});
		expect(state.view.mood).not.toBe("grumpy");
		expect(state.view.mood).not.toBe("sad");
		expect(state.view.behavior).not.toBe("hibernating");
	});

	it("never decreases stored growth stage or active days", () => {
		const state = calculatePetState({
			pet: pet({
				growthStage: "adult",
				activeDays: 80,
				growthPoints: 200_000,
			}),
			contributionDays: [],
			now: weekdayNoon,
		});
		expect(state.growthStage).toBe("adult");
		expect(state.activeDays).toBe(80);
		expect(state.growthPoints).toBe(200_000);
	});

	it("advances last active date only when today is active", () => {
		const state = calculatePetState({
			pet: pet({ lastActiveDate: "2026-09-04" }),
			contributionDays: [day("2026-09-07", 1)],
			now: weekdayNoon,
		});
		expect(state.lastActiveDate).toBe("2026-09-04");
	});
});

describe("growth through calculatePetState", () => {
	it("hatches only after both elapsed and active-day thresholds", () => {
		const bornAt = "2026-09-05T00:00:00.000Z";
		const notYet = calculatePetState({
			pet: pet({ bornAt }),
			contributionDays: [day("2026-09-05", 4)],
			now: weekdayNoon,
		});
		expect(notYet.growthStage).toBe("egg");

		const hatched = calculatePetState({
			pet: pet({ bornAt }),
			contributionDays: [day("2026-09-05", 1), day("2026-09-07", 1)],
			now: weekdayNoon,
		});
		expect(hatched.growthStage).toBe("hatchling");
		expect(hatched.activeDays).toBe(2);
	});
});

describe("calendar helpers used by inactivity", () => {
	it("walks UTC dates without using the local timezone", () => {
		expect(addUtcCalendarDays("2026-09-08", 1)).toBe("2026-09-09");
		expect(addUtcCalendarDays("2026-12-31", 1)).toBe("2027-01-01");
	});
});
