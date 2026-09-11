import { GITHUB_API_ORIGIN, GITHUB_WEB_ORIGIN } from "@gittygotchi/config";
import type { GitHubFetch } from "../../src/github/github-client.ts";

export const MOCK_GITHUB_CREATED_AT = "2011-01-01T00:00:00.000Z";

export const PARSEABLE_CONTRIBUTION_HTML = `<table>
	<td class="ContributionCalendar-day" data-date="2026-09-06" data-level="1"></td>
	<td class="ContributionCalendar-day" data-date="2026-09-07" data-level="4"></td>
	<td class="ContributionCalendar-day" data-date="2026-09-08" data-level="2"></td>
</table>`;

export type MockGithubUser = { createdAt: string } | "missing" | "down";
export type MockGithubContributions = string | "missing" | "down" | "malformed";

export function mockGithubFetch(
	options: {
		users?: Record<string, MockGithubUser>;
		contributions?: Record<string, MockGithubContributions>;
	} = {},
): GitHubFetch {
	return async (url) => {
		const userPath = url.slice(`${GITHUB_API_ORIGIN}/users/`.length);
		if (url.startsWith(`${GITHUB_API_ORIGIN}/users/`) && !userPath.includes("/")) {
			const spec = options.users?.[userPath] ?? { createdAt: MOCK_GITHUB_CREATED_AT };
			if (spec === "missing") {
				return new Response("{}", { status: 404 });
			}
			if (spec === "down") {
				throw new Error("github user unavailable");
			}
			return new Response(JSON.stringify({ login: userPath, created_at: spec.createdAt }), {
				status: 200,
				headers: { "content-type": "application/json" },
			});
		}

		const prefix = `${GITHUB_WEB_ORIGIN}/users/`;
		const suffix = "/contributions";
		if (url.startsWith(prefix) && url.endsWith(suffix)) {
			const username = url.slice(prefix.length, url.length - suffix.length);
			const spec = options.contributions?.[username] ?? PARSEABLE_CONTRIBUTION_HTML;
			if (spec === "missing") {
				return new Response("", { status: 404 });
			}
			if (spec === "down") {
				throw new Error("github contributions unavailable");
			}
			if (spec === "malformed") {
				return new Response("<html><body>no calendar</body></html>", { status: 200 });
			}
			return new Response(spec, {
				status: 200,
				headers: { "content-type": "text/html" },
			});
		}

		throw new Error(`unexpected GitHub fetch ${url}`);
	};
}
