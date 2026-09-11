import {
	CONTRIBUTION_FRESHNESS_TTL_SECONDS,
	GITHUB_API_ORIGIN,
	GITHUB_API_VERSION,
	GITHUB_USER_AGENT,
	GITHUB_WEB_ORIGIN,
} from "@gittygotchi/config";
import { describe, expect, it } from "vitest";
import { createContributionProvider } from "../../src/github/contribution-provider.ts";
import { createGitHubClient, type GitHubFetch } from "../../src/github/github-client.ts";
import { githubContributionsUrl, githubUserUrl } from "../../src/github/urls.ts";
import { createGitHubUserProvider } from "../../src/github/user-provider.ts";
import { loadGithubFixture } from "./load-fixture.ts";

function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json", ...headers },
	});
}

describe("github urls", () => {
	it("builds internal GitHub URLs from validated usernames", () => {
		expect(githubUserUrl("AlpDogan")).toBe(`${GITHUB_API_ORIGIN}/users/alpdogan`);
		expect(githubContributionsUrl("alpdogan")).toBe(
			`${GITHUB_WEB_ORIGIN}/users/alpdogan/contributions`,
		);
	});

	it("does not construct URLs from invalid usernames", () => {
		expect(githubUserUrl("../etc")).toBeUndefined();
		expect(githubContributionsUrl("https://evil.example")).toBeUndefined();
	});
});

describe("GitHubUserProvider", () => {
	it("parses login and created_at", async () => {
		const provider = createGitHubUserProvider(
			createGitHubClient({
				fetch: async (url, init) => {
					expect(url).toBe(`${GITHUB_API_ORIGIN}/users/alpdogan`);
					expect(init.headers["user-agent"]).toBe(GITHUB_USER_AGENT);
					expect(init.headers["x-github-api-version"]).toBe(GITHUB_API_VERSION);
					return jsonResponse({
						login: "AlpDogan",
						created_at: "2014-01-15T00:00:00Z",
					});
				},
			}),
		);

		await expect(provider.getUser("AlpDogan")).resolves.toEqual({
			ok: true,
			value: { login: "alpdogan", createdAt: "2014-01-15T00:00:00Z" },
		});
	});

	it("maps 404 to github_user_not_found", async () => {
		const provider = createGitHubUserProvider(
			createGitHubClient({
				fetch: async () => jsonResponse({ message: "Not Found" }, 404),
			}),
		);

		await expect(provider.getUser("octocat")).resolves.toEqual({
			ok: false,
			error: { type: "github_user_not_found", username: "octocat" },
		});
	});

	it("maps 403 rate limits", async () => {
		const provider = createGitHubUserProvider(
			createGitHubClient({
				fetch: async () =>
					jsonResponse({ message: "API rate limit exceeded" }, 403, { "retry-after": "60" }),
			}),
		);

		await expect(provider.getUser("octocat")).resolves.toEqual({
			ok: false,
			error: { type: "github_rate_limited", retryAfterSeconds: 60 },
		});
	});

	it("does not call GitHub for invalid usernames", async () => {
		const provider = createGitHubUserProvider(
			createGitHubClient({
				fetch: async () => {
					throw new Error("fetch should not run");
				},
			}),
		);

		await expect(provider.getUser("not_a_user")).resolves.toEqual({
			ok: false,
			error: { type: "invalid_username" },
		});
	});

	it("invokes a detached this-sensitive fetch without illegal invocation", async () => {
		const owner = {
			async fetch(
				this: unknown,
				url: string,
				init: {
					method: "GET";
					headers: Record<string, string>;
					redirect: "follow";
					signal: AbortSignal;
				},
			) {
				if (this == null) {
					throw new TypeError("Illegal invocation");
				}
				expect(url).toBe(`${GITHUB_API_ORIGIN}/users/alpdogan`);
				expect(init.headers["user-agent"]).toBe(GITHUB_USER_AGENT);
				return jsonResponse({
					login: "alpdogan",
					created_at: "2014-01-15T00:00:00Z",
				});
			},
		};
		const provider = createGitHubUserProvider(
			createGitHubClient({
				fetch: owner.fetch as GitHubFetch,
			}),
		);

		await expect(provider.getUser("alpdogan")).resolves.toEqual({
			ok: true,
			value: { login: "alpdogan", createdAt: "2014-01-15T00:00:00Z" },
		});
	});

	it("treats network failures as github_unavailable", async () => {
		const provider = createGitHubUserProvider(
			createGitHubClient({
				fetch: async () => {
					throw new Error("network down");
				},
			}),
		);

		await expect(provider.getUser("alpdogan")).resolves.toEqual({
			ok: false,
			error: { type: "github_unavailable" },
		});
	});
});

describe("ContributionProvider", () => {
	it("parses HTML and drops future days using injected time", async () => {
		const provider = createContributionProvider({
			now: () => new Date("2026-09-08T12:00:00.000Z"),
			client: createGitHubClient({
				fetch: async (url, init) => {
					expect(url).toBe(`${GITHUB_WEB_ORIGIN}/users/alpdogan/contributions`);
					expect(init.cf).toEqual({
						cacheEverything: true,
						cacheTtl: CONTRIBUTION_FRESHNESS_TTL_SECONDS,
					});
					return new Response(loadGithubFixture("contributions-future-days.html"), {
						status: 200,
						headers: { "content-type": "text/html" },
					});
				},
			}),
		});

		await expect(provider.getContributions("alpdogan")).resolves.toEqual({
			ok: true,
			value: [{ date: "2026-09-08", level: 1 }],
		});
	});

	it("surfaces parser failure instead of an empty calendar", async () => {
		const provider = createContributionProvider({
			now: () => new Date("2026-09-08T12:00:00.000Z"),
			client: createGitHubClient({
				fetch: async () =>
					new Response(loadGithubFixture("contributions-malformed.html"), { status: 200 }),
			}),
		});

		await expect(provider.getContributions("alpdogan")).resolves.toEqual({
			ok: false,
			error: { type: "contribution_parse_failed" },
		});
	});
});
