export const GROWTH_STAGES = ["egg", "hatchling", "baby", "young", "adult", "mature"] as const;

export type GrowthStage = (typeof GROWTH_STAGES)[number];

export function isGrowthStage(value: string): value is GrowthStage {
	return (GROWTH_STAGES as readonly string[]).includes(value);
}
