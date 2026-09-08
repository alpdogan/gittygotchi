import type { ContributionDay } from "@gittygotchi/domain";
import {
	excludeFutureContributionDays,
	parseGitHubUsername,
	utcCalendarDate,
} from "@gittygotchi/domain";
import { parseContributionHtml } from "./contribution-parser.ts";
import type { GitHubResult } from "./errors.ts";
import type { GitHubClient } from "./github-client.ts";

export type ContributionProvider = {
	getContributions(username: string): Promise<GitHubResult<ContributionDay[]>>;
};

export function createContributionProvider(options: {
	client: GitHubClient;
	now: () => Date;
}): ContributionProvider {
	return {
		async getContributions(username) {
			const parsed = parseGitHubUsername(username);
			if (!parsed.ok) {
				return { ok: false, error: { type: "invalid_username" } };
			}

			const html = await options.client.getContributionHtml(parsed.username);
			if (!html.ok) {
				return html;
			}

			const parsedDays = parseContributionHtml(html.value);
			if (!parsedDays.ok) {
				return parsedDays;
			}

			return {
				ok: true,
				value: excludeFutureContributionDays(parsedDays.value, utcCalendarDate(options.now())),
			};
		},
	};
}
