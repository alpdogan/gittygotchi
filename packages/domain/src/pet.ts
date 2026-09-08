import type { GittyClass } from "./class.ts";
import type { GrowthStage } from "./growth.ts";
import type { Behavior, Hunger, Mood } from "./state.ts";

export type PetSnapshot = {
	username: string;
	gittyClass: GittyClass;
	classAlgorithmVersion: string;
	githubCreatedAt: string;
	bornAt: string;
	growthStage: GrowthStage;
	growthPoints: number;
	activeDays: number;
	lastActiveDate?: string;
};

export type VisiblePetState = {
	gittyClass: GittyClass;
	growthStage: GrowthStage;
	hunger: Hunger;
	mood: Mood;
	behavior: Behavior;
};

export type PetLifecycle = {
	growthStage: GrowthStage;
	growthPoints: number;
	activeDays: number;
	lastActiveDate?: string;
	view: VisiblePetState;
};
