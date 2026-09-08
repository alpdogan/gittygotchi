import { parseGitHubUsername } from "@gittygotchi/domain";
import type { GitHubResult, GitHubUser } from "./errors.ts";
import type { GitHubClient } from "./github-client.ts";

export type GitHubUserProvider = {
	getUser(username: string): Promise<GitHubResult<GitHubUser>>;
};

function parseUserJson(text: string): GitHubResult<GitHubUser> {
	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		return { ok: false, error: { type: "github_unavailable" } };
	}

	if (parsed === null || typeof parsed !== "object") {
		return { ok: false, error: { type: "github_unavailable" } };
	}

	const record = parsed as { login?: unknown; created_at?: unknown };
	if (typeof record.login !== "string" || typeof record.created_at !== "string") {
		return { ok: false, error: { type: "github_unavailable" } };
	}

	if (Number.isNaN(Date.parse(record.created_at))) {
		return { ok: false, error: { type: "github_unavailable" } };
	}

	const login = parseGitHubUsername(record.login);
	if (!login.ok) {
		return { ok: false, error: { type: "github_unavailable" } };
	}

	return {
		ok: true,
		value: {
			login: login.username,
			createdAt: record.created_at,
		},
	};
}

export function createGitHubUserProvider(client: GitHubClient): GitHubUserProvider {
	return {
		async getUser(username) {
			const parsed = parseGitHubUsername(username);
			if (!parsed.ok) {
				return { ok: false, error: { type: "invalid_username" } };
			}

			const json = await client.getUserJson(parsed.username);
			if (!json.ok) {
				return json;
			}

			return parseUserJson(json.value);
		},
	};
}
