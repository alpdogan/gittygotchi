export const SVG_CACHE_TTL_SECONDS = 10 * 60;

export const CONTRIBUTION_FRESHNESS_TTL_SECONDS = 20 * 60;

export const NOT_FOUND_SVG_CACHE_TTL_SECONDS = 60;

export function isContributionFresh(lastGithubSyncAt: string | undefined, now: Date): boolean {
	if (lastGithubSyncAt === undefined) {
		return false;
	}

	const synced = Date.parse(lastGithubSyncAt);
	if (Number.isNaN(synced)) {
		return false;
	}

	return now.getTime() - synced < CONTRIBUTION_FRESHNESS_TTL_SECONDS * 1000;
}
