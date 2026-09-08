import { CONTRIBUTION_FRESHNESS_TTL_SECONDS, SVG_CACHE_TTL_SECONDS } from "@gittygotchi/config";
import { describe, expect, it } from "vitest";
import {
	canonicalPetSvgRequest,
	decideContributionRefresh,
	errorSvgCacheControl,
	fallbackWhenGithubFails,
	fallbackWhenParseFails,
	petSvgUsername,
	SVG_CACHE_CONTROL,
} from "../../src/cache/index.ts";

const now = new Date("2026-09-08T12:00:00.000Z");

describe("canonical pet SVG cache key", () => {
	it("uses the normalized username path and drops query strings", () => {
		const request = canonicalPetSvgRequest("alpdogan");
		expect(new URL(request.url).pathname).toBe("/alpdogan.svg");
		expect(new URL(request.url).search).toBe("");
		expect(request.method).toBe("GET");
		expect(petSvgUsername(new Request("https://example.test/AlpDogan.svg?cb=1"))).toBe("alpdogan");
	});
});

describe("contribution freshness", () => {
	it("does not call GitHub while stored activity is fresh", () => {
		expect(
			decideContributionRefresh({
				adopted: true,
				lastGithubSyncAt: "2026-09-08T11:50:00.000Z",
				now,
			}),
		).toEqual({ type: "skip_github", reason: "fresh" });
	});

	it("fetches GitHub on first adoption and after the freshness TTL", () => {
		expect(decideContributionRefresh({ adopted: false, now })).toEqual({
			type: "fetch_github",
			reason: "adoption",
		});
		expect(decideContributionRefresh({ adopted: true, now })).toEqual({
			type: "fetch_github",
			reason: "never_synced",
		});
		expect(
			decideContributionRefresh({
				adopted: true,
				lastGithubSyncAt: new Date(
					now.getTime() - CONTRIBUTION_FRESHNESS_TTL_SECONDS * 1000,
				).toISOString(),
				now,
			}),
		).toEqual({ type: "fetch_github", reason: "stale" });
	});
});

describe("stale fallback", () => {
	it("serves stored state when GitHub fails after adoption", () => {
		expect(
			fallbackWhenGithubFails({
				hasStoredPet: true,
				error: { type: "github_unavailable" },
			}),
		).toEqual({ type: "use_stored", reason: "stale_contributions" });
		expect(fallbackWhenParseFails(true)).toEqual({
			type: "use_stored",
			reason: "keep_known_activity",
		});
	});

	it("returns an error SVG only when nothing usable exists", () => {
		expect(
			fallbackWhenGithubFails({
				hasStoredPet: false,
				error: { type: "github_user_not_found", username: "missing" },
			}),
		).toEqual({ type: "error", kind: "github_user_not_found" });
		expect(fallbackWhenParseFails(false)).toEqual({
			type: "error",
			kind: "github_unavailable",
		});
	});
});

describe("SVG cache headers", () => {
	it("caches successful and invalid-username images, not GitHub outages", () => {
		expect(SVG_CACHE_CONTROL).toBe(`public, max-age=${SVG_CACHE_TTL_SECONDS}`);
		expect(errorSvgCacheControl("invalid_username")).toBe(SVG_CACHE_CONTROL);
		expect(errorSvgCacheControl("github_user_not_found")).toBe("public, max-age=60");
		expect(errorSvgCacheControl("github_unavailable")).toBe("no-store");
		expect(errorSvgCacheControl("internal")).toBe("no-store");
	});
});
