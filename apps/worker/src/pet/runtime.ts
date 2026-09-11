import {
	type ContributionProvider,
	createContributionProvider,
	createGitHubClient,
	createGitHubUserProvider,
	type GitHubFetch,
	type GitHubUserProvider,
} from "../github/index.ts";
import { createD1PetRepository } from "../storage/d1-pet-repository.ts";
import type { PetRepository } from "../storage/pet-repository.ts";
import { type LivePetResult, resolveLivePet } from "./resolve.ts";

export type PetRuntime = {
	repository: PetRepository;
	users: GitHubUserProvider;
	contributions: ContributionProvider;
	now: () => Date;
};

let githubFetchOverride: GitHubFetch | undefined;
let nowOverride: (() => Date) | undefined;

export function setGithubFetchForTests(fetch: GitHubFetch | undefined): void {
	githubFetchOverride = fetch;
}

export function setNowForTests(now: (() => Date) | undefined): void {
	nowOverride = now;
}

export function createPetRuntime(
	env: Env,
	options: { fetch?: GitHubFetch; now?: () => Date } = {},
): PetRuntime {
	const githubFetch = options.fetch ?? githubFetchOverride ?? (globalThis.fetch as GitHubFetch);
	const now = options.now ?? nowOverride ?? (() => new Date());
	const client = createGitHubClient({ fetch: githubFetch });
	return {
		repository: createD1PetRepository(env.DB),
		users: createGitHubUserProvider(client),
		contributions: createContributionProvider({ client, now }),
		now,
	};
}

export function resolveLivePetFromEnv(
	env: Env,
	username: string,
	options: { fetch?: GitHubFetch; now?: () => Date } = {},
): Promise<LivePetResult> {
	const runtime = createPetRuntime(env, options);
	return resolveLivePet({
		repository: runtime.repository,
		users: runtime.users,
		contributions: runtime.contributions,
		username,
		now: runtime.now(),
	});
}
