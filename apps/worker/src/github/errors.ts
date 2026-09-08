export type GitHubUser = {
	login: string;
	createdAt: string;
};

export type GitHubAdapterError =
	| { type: "invalid_username" }
	| { type: "github_user_not_found"; username: string }
	| { type: "github_rate_limited"; retryAfterSeconds?: number }
	| { type: "github_unavailable" }
	| { type: "contribution_parse_failed" };

export type GitHubResult<T> = { ok: true; value: T } | { ok: false; error: GitHubAdapterError };
