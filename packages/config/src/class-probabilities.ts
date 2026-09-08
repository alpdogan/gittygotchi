import { NORMAL_GITTY_CLASSES } from "@gittygotchi/domain";

export type PsyProbabilityBand = {
	maxInclusiveYears: number | null;
	psyProbability: number;
};

export const CLASS_ALGORITHM_VERSION = "v1";

export const CLASS_SEED_VERSION = "gittygotchi-class-v1";

export const PSY_PROBABILITY_BANDS: readonly PsyProbabilityBand[] = [
	{ maxInclusiveYears: 2, psyProbability: 0.01 },
	{ maxInclusiveYears: 5, psyProbability: 0.03 },
	{ maxInclusiveYears: 8, psyProbability: 0.05 },
	{ maxInclusiveYears: 10, psyProbability: 0.08 },
	{ maxInclusiveYears: 15, psyProbability: 0.12 },
	{ maxInclusiveYears: null, psyProbability: 0.18 },
];

export const EQUAL_NORMAL_CLASSES = NORMAL_GITTY_CLASSES;
