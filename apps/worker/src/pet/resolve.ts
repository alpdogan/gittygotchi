import {
	type ContributionDay,
	type ContributionLevel,
	calculatePetState,
	isContributionLevel,
	utcCalendarDate,
	type VisiblePetState,
} from "@gittygotchi/domain";
import type { ErrorSvgKind } from "@gittygotchi/svg";
import {
	decideContributionRefresh,
	fallbackWhenGithubFails,
	fallbackWhenParseFails,
} from "../cache/stale.ts";
import type { ContributionProvider } from "../github/contribution-provider.ts";
import type { GitHubUserProvider } from "../github/user-provider.ts";
import { adoptPet } from "../storage/adopt.ts";
import type { PetRepository, StoredPet } from "../storage/pet-repository.ts";
import {
	lifecycleUpdateFromState,
	petSnapshotFromStored,
	saveLifecycleIfChanged,
} from "../storage/pet-repository.ts";

export type LivePetSuccess = {
	ok: true;
	pet: StoredPet;
	view: VisiblePetState;
	created: boolean;
};

export type LivePetFailure = {
	ok: false;
	error: { kind: ErrorSvgKind };
};

export type LivePetResult = LivePetSuccess | LivePetFailure;

export async function resolveLivePet(input: {
	repository: PetRepository;
	users: GitHubUserProvider;
	contributions: ContributionProvider;
	username: string;
	now: Date;
}): Promise<LivePetResult> {
	const existing = await input.repository.getByUsername(input.username);
	let pet = existing;
	let created = false;

	if (pet === undefined) {
		const user = await input.users.getUser(input.username);
		if (!user.ok) {
			return githubFailure({ hasStoredPet: false, error: user.error });
		}

		const adopted = await adoptPet({
			repository: input.repository,
			username: input.username,
			githubCreatedAt: user.value.createdAt,
			now: input.now,
		});
		if (!adopted.ok) {
			return { ok: false, error: { kind: "invalid_username" } };
		}

		pet = adopted.pet;
		created = adopted.created;
	}

	const refresh = decideContributionRefresh({
		adopted: true,
		now: input.now,
		...(pet.lastGithubSyncAt === undefined ? {} : { lastGithubSyncAt: pet.lastGithubSyncAt }),
	});
	if (refresh.type === "skip_github") {
		return { ok: true, pet, view: visibleStateFromStored(pet, input.now), created };
	}

	const contributions = await input.contributions.getContributions(input.username);
	if (!contributions.ok) {
		const fallback =
			contributions.error.type === "contribution_parse_failed"
				? fallbackWhenParseFails(true)
				: fallbackWhenGithubFails({ hasStoredPet: true, error: contributions.error });
		if (fallback.type === "error") {
			return { ok: false, error: { kind: fallback.kind } };
		}
		return { ok: true, pet, view: visibleStateFromStored(pet, input.now), created };
	}

	const lifecycle = calculatePetState({
		pet: petSnapshotFromStored(pet),
		contributionDays: contributions.value,
		now: input.now,
	});
	const saved = await saveLifecycleIfChanged(
		input.repository,
		pet,
		lifecycleUpdateFromState({
			lifecycle,
			lastContributionLevel: contributionLevelOn(contributions.value, utcCalendarDate(input.now)),
			lastGithubSyncAt: input.now.toISOString(),
			updatedAt: input.now.toISOString(),
		}),
	);

	return { ok: true, pet: saved, view: lifecycle.view, created };
}

export function visibleStateFromStored(pet: StoredPet, now: Date): VisiblePetState {
	const days: ContributionDay[] = [];
	if (pet.lastActiveDate !== undefined) {
		days.push({ date: pet.lastActiveDate, level: pet.lastContributionLevel });
	}

	const lifecycle = calculatePetState({
		pet: {
			...petSnapshotFromStored(pet),
			bornAt: now.toISOString(),
		},
		contributionDays: days,
		now,
	});

	return {
		...lifecycle.view,
		gittyClass: pet.gittyClass,
		growthStage: pet.growthStage,
	};
}

function contributionLevelOn(days: readonly ContributionDay[], date: string): ContributionLevel {
	for (const day of days) {
		if (day.date === date && isContributionLevel(day.level)) {
			return day.level;
		}
	}
	return 0;
}

function githubFailure(input: {
	hasStoredPet: boolean;
	error: Parameters<typeof fallbackWhenGithubFails>[0]["error"];
}): LivePetFailure {
	const fallback = fallbackWhenGithubFails(input);
	if (fallback.type === "error") {
		return { ok: false, error: { kind: fallback.kind } };
	}
	return { ok: false, error: { kind: "internal" } };
}
