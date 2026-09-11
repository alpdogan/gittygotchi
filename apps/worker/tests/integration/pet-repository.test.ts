import { env } from "cloudflare:workers";
import { assignGittyClass, calculatePetState } from "@gittygotchi/domain";
import { describe, expect, it } from "vitest";
import { adoptPet } from "../../src/storage/adopt.ts";
import { createD1PetRepository, isMissingPetsTable } from "../../src/storage/d1-pet-repository.ts";
import {
	lifecycleUpdateFromState,
	parseStoredPet,
	petSnapshotFromStored,
	saveLifecycleIfChanged,
} from "../../src/storage/pet-repository.ts";

const now = new Date("2026-09-08T12:00:00.000Z");

function repository() {
	return createD1PetRepository(env.DB);
}

describe("isMissingPetsTable", () => {
	it("recognizes a missing pets table without swallowing other D1 errors", () => {
		expect(isMissingPetsTable(new Error("D1_ERROR: no such table: pets: SQLITE_ERROR"))).toBe(true);
		expect(isMissingPetsTable(new Error("UNIQUE constraint failed: pets.github_username"))).toBe(
			false,
		);
		expect(isMissingPetsTable(new Error("D1_ERROR: no such table: contribution_days"))).toBe(false);
	});
});

describe("parseStoredPet", () => {
	it("rejects malformed rows instead of guessing class or stage", () => {
		expect(parseStoredPet(null)).toBeUndefined();
		expect(
			parseStoredPet({
				id: 1,
				github_username: "alpdogan",
				github_created_at: "2011-01-01T00:00:00.000Z",
				born_at: "2026-09-08T12:00:00.000Z",
				class: "electric",
				class_algorithm_version: "v1",
				growth_stage: "egg",
				growth_points: 0,
				active_days: 0,
				last_active_date: null,
				last_contribution_level: 0,
				last_github_sync_at: null,
				created_at: "2026-09-08T12:00:00.000Z",
				updated_at: "2026-09-08T12:00:00.000Z",
			}),
		).toBeUndefined();
	});
});

describe("D1 pet repository", () => {
	it("creates an egg and looks it up by normalized username", async () => {
		const created = await adoptPet({
			repository: repository(),
			username: "AlpDogan",
			githubCreatedAt: "2011-01-01T00:00:00.000Z",
			now,
		});
		expect(created.ok).toBe(true);
		if (!created.ok) {
			return;
		}
		expect(created.created).toBe(true);
		expect(created.pet.username).toBe("alpdogan");
		expect(created.pet.growthStage).toBe("egg");
		expect(created.pet.activeDays).toBe(0);
		expect(created.pet.githubCreatedAt).toBe("2011-01-01T00:00:00.000Z");

		const loaded = await repository().getByUsername("alpdogan");
		expect(loaded).toEqual(created.pet);
	});

	it("does not reroll class on a second adoption", async () => {
		const first = await adoptPet({
			repository: repository(),
			username: "octocat",
			githubCreatedAt: "2011-01-01T00:00:00.000Z",
			now,
		});
		const later = new Date("2026-09-09T12:00:00.000Z");
		const second = await adoptPet({
			repository: repository(),
			username: "octocat",
			githubCreatedAt: "2011-01-01T00:00:00.000Z",
			now: later,
		});
		expect(first.ok && second.ok).toBe(true);
		if (!first.ok || !second.ok) {
			return;
		}
		expect(second.created).toBe(false);
		expect(second.pet.gittyClass).toBe(first.pet.gittyClass);
		expect(second.pet.classAlgorithmVersion).toBe(first.pet.classAlgorithmVersion);
		expect(second.pet.bornAt).toBe(first.pet.bornAt);
		expect(second.pet.id).toBe(first.pet.id);
	});

	it("lets UNIQUE decide concurrent first inserts and re-reads the winner", async () => {
		const assignment = await assignGittyClass({
			username: "hubot",
			githubCreatedAt: "2014-06-01T00:00:00.000Z",
			now,
		});
		const createdAt = now.toISOString();
		const draft = {
			username: "hubot",
			githubCreatedAt: "2014-06-01T00:00:00.000Z",
			bornAt: createdAt,
			gittyClass: assignment.gittyClass,
			classAlgorithmVersion: assignment.algorithmVersion,
			createdAt,
		};
		const [first, second] = await Promise.all([
			repository().create(draft),
			repository().create(draft),
		]);
		const types = [first.type, second.type].slice().sort();
		expect(types).toEqual(["already_exists", "created"]);
		expect(first.pet.id).toBe(second.pet.id);
		expect(first.pet.gittyClass).toBe(second.pet.gittyClass);
		expect(first.pet.gittyClass).toBe(assignment.gittyClass);
	});

	it("persists growth without rewriting class, then skips no-op writes", async () => {
		const adopted = await adoptPet({
			repository: repository(),
			username: "monalisa",
			githubCreatedAt: "2015-01-01T00:00:00.000Z",
			now: new Date("2026-09-05T00:00:00.000Z"),
		});
		expect(adopted.ok).toBe(true);
		if (!adopted.ok) {
			return;
		}

		const lifecycle = calculatePetState({
			pet: petSnapshotFromStored(adopted.pet),
			contributionDays: [
				{ date: "2026-09-05", level: 1 },
				{ date: "2026-09-07", level: 1 },
				{ date: "2026-09-08", level: 4 },
			],
			now,
		});
		const update = lifecycleUpdateFromState({
			lifecycle,
			lastContributionLevel: 4,
			lastGithubSyncAt: now.toISOString(),
			updatedAt: now.toISOString(),
		});
		const saved = await saveLifecycleIfChanged(repository(), adopted.pet, update);
		expect(saved.gittyClass).toBe(adopted.pet.gittyClass);
		expect(saved.growthStage).toBe("hatchling");
		expect(saved.activeDays).toBe(3);
		expect(saved.lastActiveDate).toBe("2026-09-08");
		expect(saved.lastContributionLevel).toBe(4);
		expect(saved.lastGithubSyncAt).toBe(now.toISOString());
		expect(saved.bornAt).toBe(adopted.pet.bornAt);

		const skipped = await saveLifecycleIfChanged(repository(), saved, {
			...update,
			updatedAt: "2026-09-08T13:00:00.000Z",
		});
		expect(skipped.updatedAt).toBe(saved.updatedAt);
		expect(skipped.gittyClass).toBe(adopted.pet.gittyClass);
	});

	it("fails clearly when the pets table is missing", async () => {
		await env.DB.prepare("DROP TABLE pets").run();
		await expect(repository().getByUsername("alpdogan")).rejects.toThrow(
			"D1 pets table is missing",
		);
	});

	it("rejects invalid usernames before touching D1", async () => {
		await expect(
			adoptPet({
				repository: repository(),
				username: "../etc",
				githubCreatedAt: "2011-01-01T00:00:00.000Z",
				now,
			}),
		).resolves.toEqual({ ok: false, error: { type: "invalid_username" } });
	});
});
