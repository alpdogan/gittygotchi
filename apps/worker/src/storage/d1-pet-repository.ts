import type { CreatePetResult, PetRepository, StoredPet } from "./pet-repository.ts";
import { parseStoredPet } from "./pet-repository.ts";

const SELECT_BY_USERNAME = `SELECT
	id,
	github_username,
	github_created_at,
	born_at,
	class,
	class_algorithm_version,
	growth_stage,
	growth_points,
	active_days,
	last_active_date,
	last_contribution_level,
	last_github_sync_at,
	created_at,
	updated_at
FROM pets
WHERE github_username = ?`;

const INSERT_PET = `INSERT INTO pets (
	github_username,
	github_created_at,
	born_at,
	class,
	class_algorithm_version,
	growth_stage,
	growth_points,
	active_days,
	last_active_date,
	last_contribution_level,
	last_github_sync_at,
	created_at,
	updated_at
) VALUES (?, ?, ?, ?, ?, 'egg', 0, 0, NULL, 0, NULL, ?, ?)
RETURNING
	id,
	github_username,
	github_created_at,
	born_at,
	class,
	class_algorithm_version,
	growth_stage,
	growth_points,
	active_days,
	last_active_date,
	last_contribution_level,
	last_github_sync_at,
	created_at,
	updated_at`;

const UPDATE_LIFECYCLE = `UPDATE pets SET
	growth_stage = ?,
	growth_points = ?,
	active_days = ?,
	last_active_date = ?,
	last_contribution_level = ?,
	last_github_sync_at = ?,
	updated_at = ?
WHERE github_username = ?
RETURNING
	id,
	github_username,
	github_created_at,
	born_at,
	class,
	class_algorithm_version,
	growth_stage,
	growth_points,
	active_days,
	last_active_date,
	last_contribution_level,
	last_github_sync_at,
	created_at,
	updated_at`;

export function createD1PetRepository(db: D1Database): PetRepository {
	return {
		async getByUsername(username) {
			try {
				const row = await db.prepare(SELECT_BY_USERNAME).bind(username).first();
				return row === null ? undefined : requireStoredPet(row);
			} catch (error) {
				rethrowD1(error);
			}
		},

		async create(pet) {
			try {
				const row = await db
					.prepare(INSERT_PET)
					.bind(
						pet.username,
						pet.githubCreatedAt,
						pet.bornAt,
						pet.gittyClass,
						pet.classAlgorithmVersion,
						pet.createdAt,
						pet.createdAt,
					)
					.first();
				return { type: "created", pet: requireStoredPet(row) };
			} catch (error) {
				if (!isUniqueConstraint(error)) {
					rethrowD1(error);
				}
				try {
					const existing = await db.prepare(SELECT_BY_USERNAME).bind(pet.username).first();
					if (existing === null) {
						rethrowD1(error);
					}
					return { type: "already_exists", pet: requireStoredPet(existing) };
				} catch (lookupError) {
					rethrowD1(lookupError);
				}
			}
		},

		async updateLifecycle(username, update) {
			try {
				const row = await db
					.prepare(UPDATE_LIFECYCLE)
					.bind(
						update.growthStage,
						update.growthPoints,
						update.activeDays,
						optionalBind(update.lastActiveDate),
						update.lastContributionLevel,
						optionalBind(update.lastGithubSyncAt),
						update.updatedAt,
						username,
					)
					.first();
				return row === null ? undefined : requireStoredPet(row);
			} catch (error) {
				rethrowD1(error);
			}
		},
	};
}

export function isMissingPetsTable(error: unknown): boolean {
	return errorChainIncludes(error, (message) => message.includes("no such table: pets"));
}

export function isUniqueConstraint(error: unknown): boolean {
	return errorChainIncludes(
		error,
		(message) =>
			message.includes("UNIQUE constraint failed") || message.includes("SQLITE_CONSTRAINT"),
	);
}

function errorChainIncludes(error: unknown, match: (message: string) => boolean): boolean {
	let current: unknown = error;
	const seen = new Set<unknown>();
	while (current instanceof Error && !seen.has(current)) {
		seen.add(current);
		if (match(current.message)) {
			return true;
		}
		current = current.cause;
	}
	return false;
}

function rethrowD1(error: unknown): never {
	if (isMissingPetsTable(error)) {
		throw new Error(
			"D1 pets table is missing. Apply migrations with wrangler d1 migrations apply gittygotchi --local (or --remote).",
			{ cause: error },
		);
	}
	throw error;
}

function optionalBind(value: string | undefined): string | null {
	return value === undefined ? null : value;
}

function requireStoredPet(row: unknown): StoredPet {
	const pet = parseStoredPet(row);
	if (pet === undefined) {
		throw new Error("stored pet row is invalid");
	}
	return pet;
}

export type { CreatePetResult, PetRepository, StoredPet };
