import {
	CLASS_ALGORITHM_VERSION,
	CLASS_SEED_VERSION,
	EQUAL_NORMAL_CLASSES,
	PSY_PROBABILITY_BANDS,
} from "@gittygotchi/config";
import { type GittyClass, isNormalGittyClass } from "./class.ts";

export type ClassAssignment = {
	gittyClass: GittyClass;
	algorithmVersion: string;
	roll: number;
	ageYears: number;
};

export function githubAccountAgeYears(githubCreatedAt: string, now: Date): number {
	const created = Date.parse(githubCreatedAt);
	return (now.getTime() - created) / (365.25 * 24 * 60 * 60 * 1000);
}

export function psyProbabilityForAgeYears(ageYears: number): number {
	for (const band of PSY_PROBABILITY_BANDS) {
		if (band.maxInclusiveYears === null || ageYears <= band.maxInclusiveYears) {
			return band.psyProbability;
		}
	}

	return PSY_PROBABILITY_BANDS.at(-1)?.psyProbability ?? 0.18;
}

export function classFromUnitRoll(roll: number, ageYears: number): GittyClass {
	const bounded = Number.isFinite(roll) ? Math.min(Math.max(roll, 0), 1 - Number.EPSILON) : 0;
	const psyProbability = psyProbabilityForAgeYears(ageYears);

	if (bounded < psyProbability) {
		return "psy";
	}

	const remaining = 1 - psyProbability;
	const slot = remaining === 0 ? 0 : (bounded - psyProbability) / remaining;
	const index = Math.min(
		EQUAL_NORMAL_CLASSES.length - 1,
		Math.floor(slot * EQUAL_NORMAL_CLASSES.length),
	);
	const normalClass = EQUAL_NORMAL_CLASSES[index];
	if (normalClass !== undefined && isNormalGittyClass(normalClass)) {
		return normalClass;
	}
	return "earth";
}

export function classSeed(username: string, githubCreatedAt: string): string {
	return `${username}${githubCreatedAt}${CLASS_SEED_VERSION}`;
}

export function digestToUnitInterval(digest: ArrayBuffer): number {
	const view = new DataView(digest);
	const high = view.getUint32(0);
	const low = view.getUint32(4);
	const mantissa = high * 2 ** 21 + (low >>> 11);
	return mantissa / 2 ** 53;
}

export async function unitRollFromSeed(seed: string): Promise<number> {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
	return digestToUnitInterval(digest);
}

export async function assignGittyClass(input: {
	username: string;
	githubCreatedAt: string;
	now: Date;
}): Promise<ClassAssignment> {
	const ageYears = githubAccountAgeYears(input.githubCreatedAt, input.now);
	const roll = await unitRollFromSeed(classSeed(input.username, input.githubCreatedAt));
	return {
		gittyClass: classFromUnitRoll(roll, ageYears),
		algorithmVersion: CLASS_ALGORITHM_VERSION,
		roll,
		ageYears,
	};
}
