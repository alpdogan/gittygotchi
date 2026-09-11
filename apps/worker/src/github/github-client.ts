import {
	CONTRIBUTION_FRESHNESS_TTL_SECONDS,
	GITHUB_API_VERSION,
	GITHUB_CONTRIBUTIONS_MAX_BYTES,
	GITHUB_CONTRIBUTIONS_TIMEOUT_MS,
	GITHUB_USER_AGENT,
	GITHUB_USER_MAX_BYTES,
	GITHUB_USER_TIMEOUT_MS,
} from "@gittygotchi/config";
import type { GitHubAdapterError, GitHubResult } from "./errors.ts";
import { readLimitedText, timeoutSignal } from "./read-body.ts";
import { githubContributionsUrl, githubUserUrl } from "./urls.ts";

export type GitHubSubrequestCache = {
	cacheEverything?: boolean;
	cacheTtl?: number;
};

export type GitHubFetch = (
	input: string,
	init: {
		method: "GET";
		headers: Record<string, string>;
		redirect: "follow";
		signal: AbortSignal;
		cf?: GitHubSubrequestCache;
	},
) => Promise<Response>;

export type GitHubClient = {
	getUserJson(username: string): Promise<GitHubResult<string>>;
	getContributionHtml(username: string): Promise<GitHubResult<string>>;
};

function rateLimitedError(response: Response): GitHubAdapterError {
	const retryAfter = response.headers.get("retry-after");
	if (retryAfter !== null) {
		const retryAfterSeconds = Number(retryAfter);
		if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
			return { type: "github_rate_limited", retryAfterSeconds };
		}
	}

	return { type: "github_rate_limited" };
}

function unavailable(): GitHubResult<string> {
	return { ok: false, error: { type: "github_unavailable" } };
}

function invokeGitHubFetch(
	fetch: GitHubFetch,
	url: string,
	init: Parameters<GitHubFetch>[1],
): Promise<Response> {
	return Reflect.apply(fetch, globalThis, [url, init]);
}

function githubHeaders(userAgent: string, accept: string): Record<string, string> {
	const headers: Record<string, string> = {
		"user-agent": userAgent,
		accept,
	};
	if (accept === "application/vnd.github+json") {
		headers["x-github-api-version"] = GITHUB_API_VERSION;
	}
	return headers;
}

async function getText(options: {
	fetch: GitHubFetch;
	url: string | undefined;
	userAgent: string;
	timeoutMs: number;
	maxBytes: number;
	accept: string;
	notFoundUsername?: string;
	cache?: GitHubSubrequestCache;
}): Promise<GitHubResult<string>> {
	if (options.url === undefined) {
		return { ok: false, error: { type: "invalid_username" } };
	}

	let response: Response;
	try {
		response = await invokeGitHubFetch(options.fetch, options.url, {
			method: "GET",
			headers: githubHeaders(options.userAgent, options.accept),
			redirect: "follow",
			signal: timeoutSignal(options.timeoutMs),
			...(options.cache === undefined ? {} : { cf: options.cache }),
		});
	} catch {
		return unavailable();
	}

	if (response.status === 404 && options.notFoundUsername !== undefined) {
		return {
			ok: false,
			error: { type: "github_user_not_found", username: options.notFoundUsername },
		};
	}

	if (response.status === 403 || response.status === 429) {
		return { ok: false, error: rateLimitedError(response) };
	}

	if (!response.ok) {
		return unavailable();
	}

	const text = await readLimitedText(response, options.maxBytes);
	if (text === undefined) {
		return unavailable();
	}

	return { ok: true, value: text };
}

export function createGitHubClient(options: {
	fetch: GitHubFetch;
	userAgent?: string;
}): GitHubClient {
	const userAgent = options.userAgent ?? GITHUB_USER_AGENT;

	return {
		getUserJson(username) {
			return getText({
				fetch: options.fetch,
				url: githubUserUrl(username),
				userAgent,
				timeoutMs: GITHUB_USER_TIMEOUT_MS,
				maxBytes: GITHUB_USER_MAX_BYTES,
				accept: "application/vnd.github+json",
				notFoundUsername: username.trim().toLowerCase(),
			});
		},
		getContributionHtml(username) {
			return getText({
				fetch: options.fetch,
				url: githubContributionsUrl(username),
				userAgent,
				timeoutMs: GITHUB_CONTRIBUTIONS_TIMEOUT_MS,
				maxBytes: GITHUB_CONTRIBUTIONS_MAX_BYTES,
				accept: "text/html",
				notFoundUsername: username.trim().toLowerCase(),
				cache: {
					cacheEverything: true,
					cacheTtl: CONTRIBUTION_FRESHNESS_TTL_SECONDS,
				},
			});
		},
	};
}
