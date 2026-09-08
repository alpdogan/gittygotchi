export type { GittyClass, NormalGittyClass, RareGittyClass } from "./class.ts";
export {
	GITTY_CLASSES,
	isGittyClass,
	isNormalGittyClass,
	NORMAL_GITTY_CLASSES,
	RARE_GITTY_CLASS,
} from "./class.ts";
export type { ClassAssignment } from "./class-roll.ts";
export {
	assignGittyClass,
	classFromUnitRoll,
	classSeed,
	psyProbabilityForAgeYears,
} from "./class-roll.ts";
export type { ContributionDay, ContributionLevel } from "./contribution.ts";
export {
	CONTRIBUTION_LEVELS,
	excludeFutureContributionDays,
	isContributionLevel,
	isIsoCalendarDate,
	utcCalendarDate,
} from "./contribution.ts";
export type { GrowthStage } from "./growth.ts";
export { GROWTH_STAGES, isGrowthStage } from "./growth.ts";
export {
	countActiveDaysSinceAdoption,
	elapsedDaysSinceAdoption,
	resolveGrowthStage,
} from "./growth-engine.ts";
export { calculatePetState, countInactiveWeekdays } from "./lifecycle.ts";
export type { PetLifecycle, PetSnapshot, VisiblePetState } from "./pet.ts";
export type { Behavior, Hunger, Mood } from "./state.ts";
export { BEHAVIOR_STATES, HUNGER_STATES, MOOD_STATES } from "./state.ts";
export type {
	UsernameValidationFailure,
	UsernameValidationResult,
	UsernameValidationSuccess,
} from "./username.ts";
export { GITHUB_USERNAME_PATTERN, isGitHubUsername, parseGitHubUsername } from "./username.ts";
