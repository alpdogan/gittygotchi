export type { LivePetFailure, LivePetResult, LivePetSuccess } from "./resolve.ts";
export { resolveLivePet, visibleStateFromStored } from "./resolve.ts";
export type { PetRuntime } from "./runtime.ts";
export {
	createPetRuntime,
	resolveLivePetFromEnv,
	setGithubFetchForTests,
	setNowForTests,
} from "./runtime.ts";
