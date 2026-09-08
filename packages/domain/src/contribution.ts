export const CONTRIBUTION_LEVELS = [0, 1, 2, 3, 4] as const;

export type ContributionLevel = (typeof CONTRIBUTION_LEVELS)[number];

export type ContributionDay = {
	date: string;
	level: ContributionLevel;
};

const ISO_CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isContributionLevel(value: number): value is ContributionLevel {
	return (CONTRIBUTION_LEVELS as readonly number[]).includes(value);
}

export function isIsoCalendarDate(value: string): boolean {
	const match = ISO_CALENDAR_DATE.exec(value);
	if (!match) {
		return false;
	}

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const utc = new Date(Date.UTC(year, month - 1, day));

	return (
		utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day
	);
}

export function utcCalendarDate(now: Date): string {
	return now.toISOString().slice(0, 10);
}

export function excludeFutureContributionDays(
	days: readonly ContributionDay[],
	today: string,
): ContributionDay[] {
	return days.filter((day) => day.date <= today);
}
