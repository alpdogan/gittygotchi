import { isContributionFresh } from "@gittygotchi/config";
import type { ErrorSvgKind } from "@gittygotchi/svg";
import type { GitHubAdapterError } from "../github/errors.ts";

export type ContributionRefreshDecision =
	| { type: "skip_github"; reason: "fresh" }
	| { type: "fetch_github"; reason: "adoption" | "never_synced" | "stale" };

export type StoredFallback = {
	type: "use_stored";
	reason: "stale_contributions" | "keep_known_activity";
};

export type OriginErrorFallback = {
	type: "error";
	kind: ErrorSvgKind;
};

export type GithubFailureFallback = StoredFallback | OriginErrorFallback;

export function decideContributionRefresh(input: {
	adopted: boolean;
	lastGithubSyncAt?: string;
	now: Date;
}): ContributionRefreshDecision {
	if (!input.adopted) {
		return { type: "fetch_github", reason: "adoption" };
	}

	if (isContributionFresh(input.lastGithubSyncAt, input.now)) {
		return { type: "skip_github", reason: "fresh" };
	}

	if (input.lastGithubSyncAt === undefined) {
		return { type: "fetch_github", reason: "never_synced" };
	}

	return { type: "fetch_github", reason: "stale" };
}

export function fallbackWhenGithubFails(input: {
	hasStoredPet: boolean;
	error: GitHubAdapterError;
}): GithubFailureFallback {
	if (input.hasStoredPet) {
		return { type: "use_stored", reason: "stale_contributions" };
	}

	switch (input.error.type) {
		case "github_user_not_found":
			return { type: "error", kind: "github_user_not_found" };
		case "invalid_username":
			return { type: "error", kind: "invalid_username" };
		case "contribution_parse_failed":
		case "github_rate_limited":
		case "github_unavailable":
			return { type: "error", kind: "github_unavailable" };
		default: {
			const exhaustive: never = input.error;
			return exhaustive;
		}
	}
}

export function fallbackWhenParseFails(hasStoredPet: boolean): GithubFailureFallback {
	if (hasStoredPet) {
		return { type: "use_stored", reason: "keep_known_activity" };
	}

	return { type: "error", kind: "github_unavailable" };
}
