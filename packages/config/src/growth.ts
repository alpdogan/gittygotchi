export type GrowthThreshold = {
	minElapsedDays: number;
	minActiveDays: number;
};

export const GROWTH_THRESHOLDS = {
	egg: { minElapsedDays: 0, minActiveDays: 0 },
	hatchling: { minElapsedDays: 3, minActiveDays: 2 },
	baby: { minElapsedDays: 14, minActiveDays: 8 },
	young: { minElapsedDays: 45, minActiveDays: 20 },
	adult: { minElapsedDays: 120, minActiveDays: 50 },
	mature: { minElapsedDays: 365, minActiveDays: 120 },
} as const;
