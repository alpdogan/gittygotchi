export type { AdoptPetFailure, AdoptPetResult, AdoptPetSuccess } from "./adopt.ts";
export { adoptPet } from "./adopt.ts";
export { createD1PetRepository, isUniqueConstraint } from "./d1-pet-repository.ts";
export type {
	CreatePetResult,
	NewPet,
	PetLifecycleUpdate,
	PetRepository,
	StoredPet,
} from "./pet-repository.ts";
export {
	lifecycleNeedsWrite,
	lifecycleUpdateFromState,
	parseStoredPet,
	petSnapshotFromStored,
	saveLifecycleIfChanged,
} from "./pet-repository.ts";
