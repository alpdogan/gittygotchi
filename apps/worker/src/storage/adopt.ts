import { assignGittyClass, parseGitHubUsername } from "@gittygotchi/domain";
import type { CreatePetResult, PetRepository, StoredPet } from "./pet-repository.ts";

export type AdoptPetSuccess = {
	ok: true;
	pet: StoredPet;
	created: boolean;
};

export type AdoptPetFailure = {
	ok: false;
	error: { type: "invalid_username" };
};

export type AdoptPetResult = AdoptPetSuccess | AdoptPetFailure;

export async function adoptPet(input: {
	repository: PetRepository;
	username: string;
	githubCreatedAt: string;
	now: Date;
}): Promise<AdoptPetResult> {
	const parsed = parseGitHubUsername(input.username);
	if (!parsed.ok) {
		return { ok: false, error: { type: "invalid_username" } };
	}

	const existing = await input.repository.getByUsername(parsed.username);
	if (existing !== undefined) {
		return { ok: true, pet: existing, created: false };
	}

	const assignment = await assignGittyClass({
		username: parsed.username,
		githubCreatedAt: input.githubCreatedAt,
		now: input.now,
	});
	const createdAt = input.now.toISOString();
	const result: CreatePetResult = await input.repository.create({
		username: parsed.username,
		githubCreatedAt: input.githubCreatedAt,
		bornAt: createdAt,
		gittyClass: assignment.gittyClass,
		classAlgorithmVersion: assignment.algorithmVersion,
		createdAt,
	});

	return {
		ok: true,
		pet: result.pet,
		created: result.type === "created",
	};
}
