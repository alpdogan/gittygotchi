export type { GittyClass, NormalGittyClass, RareGittyClass } from "./class.ts";
export {
	GITTY_CLASSES,
	isGittyClass,
	isNormalGittyClass,
	NORMAL_GITTY_CLASSES,
	RARE_GITTY_CLASS,
} from "./class.ts";
export type { GrowthStage } from "./growth.ts";
export { GROWTH_STAGES, isGrowthStage } from "./growth.ts";
export type { Behavior, Hunger, Mood } from "./state.ts";
export { BEHAVIOR_STATES, HUNGER_STATES, MOOD_STATES } from "./state.ts";
export type {
	UsernameValidationFailure,
	UsernameValidationResult,
	UsernameValidationSuccess,
} from "./username.ts";
export { isGitHubUsername, parseGitHubUsername } from "./username.ts";
