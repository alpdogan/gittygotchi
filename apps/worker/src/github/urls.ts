import { GITHUB_API_ORIGIN, GITHUB_WEB_ORIGIN } from "@gittygotchi/config";
import { parseGitHubUsername } from "@gittygotchi/domain";

export function githubUserUrl(username: string): string | undefined {
	const parsed = parseGitHubUsername(username);
	if (!parsed.ok) {
		return undefined;
	}

	return `${GITHUB_API_ORIGIN}/users/${parsed.username}`;
}

export function githubContributionsUrl(username: string): string | undefined {
	const parsed = parseGitHubUsername(username);
	if (!parsed.ok) {
		return undefined;
	}

	return `${GITHUB_WEB_ORIGIN}/users/${parsed.username}/contributions`;
}
