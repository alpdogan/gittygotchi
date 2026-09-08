import {
	type ContributionLevel,
	type GittyClass,
	type GrowthStage,
	isContributionLevel,
	isGittyClass,
	isGrowthStage,
	isIsoCalendarDate,
	type PetLifecycle,
	type PetSnapshot,
	parseGitHubUsername,
} from "@gittygotchi/domain";

export type StoredPet = {
	id: number;
	username: string;
	githubCreatedAt: string;
	bornAt: string;
	gittyClass: GittyClass;
	classAlgorithmVersion: string;
	growthStage: GrowthStage;
	growthPoints: number;
	activeDays: number;
	lastActiveDate?: string;
	lastContributionLevel: ContributionLevel;
	lastGithubSyncAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type NewPet = {
	username: string;
	githubCreatedAt: string;
	bornAt: string;
	gittyClass: GittyClass;
	classAlgorithmVersion: string;
	createdAt: string;
};

export type PetLifecycleUpdate = {
	growthStage: GrowthStage;
	growthPoints: number;
	activeDays: number;
	lastActiveDate?: string;
	lastContributionLevel: ContributionLevel;
	lastGithubSyncAt?: string;
	updatedAt: string;
};

export type CreatePetResult =
	| { type: "created"; pet: StoredPet }
	| { type: "already_exists"; pet: StoredPet };

export type PetRepository = {
	getByUsername(username: string): Promise<StoredPet | undefined>;
	create(pet: NewPet): Promise<CreatePetResult>;
	updateLifecycle(username: string, update: PetLifecycleUpdate): Promise<StoredPet | undefined>;
};

export function petSnapshotFromStored(pet: StoredPet): PetSnapshot {
	const snapshot: PetSnapshot = {
		username: pet.username,
		gittyClass: pet.gittyClass,
		classAlgorithmVersion: pet.classAlgorithmVersion,
		githubCreatedAt: pet.githubCreatedAt,
		bornAt: pet.bornAt,
		growthStage: pet.growthStage,
		growthPoints: pet.growthPoints,
		activeDays: pet.activeDays,
	};
	if (pet.lastActiveDate !== undefined) {
		snapshot.lastActiveDate = pet.lastActiveDate;
	}
	return snapshot;
}

export function lifecycleUpdateFromState(input: {
	lifecycle: PetLifecycle;
	lastContributionLevel: ContributionLevel;
	lastGithubSyncAt: string;
	updatedAt: string;
}): PetLifecycleUpdate {
	const update: PetLifecycleUpdate = {
		growthStage: input.lifecycle.growthStage,
		growthPoints: input.lifecycle.growthPoints,
		activeDays: input.lifecycle.activeDays,
		lastContributionLevel: input.lastContributionLevel,
		lastGithubSyncAt: input.lastGithubSyncAt,
		updatedAt: input.updatedAt,
	};
	if (input.lifecycle.lastActiveDate !== undefined) {
		update.lastActiveDate = input.lifecycle.lastActiveDate;
	}
	return update;
}

export function lifecycleNeedsWrite(pet: StoredPet, update: PetLifecycleUpdate): boolean {
	return (
		pet.growthStage !== update.growthStage ||
		pet.growthPoints !== update.growthPoints ||
		pet.activeDays !== update.activeDays ||
		pet.lastActiveDate !== update.lastActiveDate ||
		pet.lastContributionLevel !== update.lastContributionLevel ||
		pet.lastGithubSyncAt !== update.lastGithubSyncAt
	);
}

export async function saveLifecycleIfChanged(
	repository: PetRepository,
	pet: StoredPet,
	update: PetLifecycleUpdate,
): Promise<StoredPet> {
	if (!lifecycleNeedsWrite(pet, update)) {
		return pet;
	}
	return (await repository.updateLifecycle(pet.username, update)) ?? pet;
}

export function parseStoredPet(row: unknown): StoredPet | undefined {
	if (row === null || typeof row !== "object") {
		return undefined;
	}
	const record = row as Record<string, unknown>;
	const username = parseGitHubUsername(stringField(record.github_username) ?? "");
	const gittyClass = stringField(record.class);
	const growthStage = stringField(record.growth_stage);
	const lastContributionLevel = numberField(record.last_contribution_level);
	const lastActiveDate = nullableString(record.last_active_date);
	const lastGithubSyncAt = nullableString(record.last_github_sync_at);
	if (
		!username.ok ||
		gittyClass === undefined ||
		!isGittyClass(gittyClass) ||
		growthStage === undefined ||
		!isGrowthStage(growthStage) ||
		lastContributionLevel === undefined ||
		!isContributionLevel(lastContributionLevel)
	) {
		return undefined;
	}

	const pet: StoredPet = {
		id: numberField(record.id) ?? Number.NaN,
		username: username.username,
		githubCreatedAt: stringField(record.github_created_at) ?? "",
		bornAt: stringField(record.born_at) ?? "",
		gittyClass,
		classAlgorithmVersion: stringField(record.class_algorithm_version) ?? "",
		growthStage,
		growthPoints: numberField(record.growth_points) ?? Number.NaN,
		activeDays: numberField(record.active_days) ?? Number.NaN,
		lastContributionLevel,
		createdAt: stringField(record.created_at) ?? "",
		updatedAt: stringField(record.updated_at) ?? "",
	};
	if (
		!Number.isInteger(pet.id) ||
		pet.id < 1 ||
		!Number.isInteger(pet.growthPoints) ||
		pet.growthPoints < 0 ||
		!Number.isInteger(pet.activeDays) ||
		pet.activeDays < 0 ||
		Number.isNaN(Date.parse(pet.githubCreatedAt)) ||
		Number.isNaN(Date.parse(pet.bornAt)) ||
		Number.isNaN(Date.parse(pet.createdAt)) ||
		Number.isNaN(Date.parse(pet.updatedAt)) ||
		pet.classAlgorithmVersion.length === 0
	) {
		return undefined;
	}
	if (lastActiveDate !== undefined) {
		if (!isIsoCalendarDate(lastActiveDate)) {
			return undefined;
		}
		pet.lastActiveDate = lastActiveDate;
	}
	if (lastGithubSyncAt !== undefined) {
		if (Number.isNaN(Date.parse(lastGithubSyncAt))) {
			return undefined;
		}
		pet.lastGithubSyncAt = lastGithubSyncAt;
	}
	return pet;
}

function stringField(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

function numberField(value: unknown): number | undefined {
	return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function nullableString(value: unknown): string | undefined {
	if (value === null || value === undefined) {
		return undefined;
	}
	return typeof value === "string" ? value : undefined;
}
