import { utcCalendarDate } from "./contribution.ts";

export type UtcClockParts = {
	date: string;
	hour: number;
	weekday: number;
};

export function utcClockParts(now: Date): UtcClockParts {
	return {
		date: utcCalendarDate(now),
		hour: now.getUTCHours(),
		weekday: now.getUTCDay(),
	};
}

export function isUtcWeekend(now: Date): boolean {
	const weekday = now.getUTCDay();
	return weekday === 0 || weekday === 6;
}

export function calendarDaysBetween(fromDate: string, toDate: string): number {
	const from = Date.parse(`${fromDate}T00:00:00.000Z`);
	const to = Date.parse(`${toDate}T00:00:00.000Z`);
	return Math.floor((to - from) / 86_400_000);
}

export function addUtcCalendarDays(date: string, days: number): string {
	const ms = Date.parse(`${date}T00:00:00.000Z`) + days * 86_400_000;
	return utcCalendarDate(new Date(ms));
}

export function isUtcWeekdayDate(date: string): boolean {
	const weekday = new Date(`${date}T00:00:00.000Z`).getUTCDay();
	return weekday !== 0 && weekday !== 6;
}
