import { excludeFutureContributionDays } from "@gittygotchi/domain";
import { describe, expect, it } from "vitest";
import { parseContributionHtml } from "../../src/github/contribution-parser.ts";
import { loadGithubFixture } from "./load-fixture.ts";

describe("parseContributionHtml", () => {
	it("extracts date and level from realistic cells", () => {
		const result = parseContributionHtml(loadGithubFixture("contributions-normal.html"));
		expect(result).toEqual({
			ok: true,
			value: [
				{ date: "2026-09-06", level: 1 },
				{ date: "2026-09-07", level: 4 },
				{ date: "2026-09-08", level: 2 },
			],
		});
	});

	it("keeps empty days as level 0", () => {
		const result = parseContributionHtml(loadGithubFixture("contributions-empty-day.html"));
		expect(result).toEqual({
			ok: true,
			value: [
				{ date: "2026-09-05", level: 0 },
				{ date: "2026-09-06", level: 3 },
			],
		});
	});

	it("keeps anonymized private activity levels", () => {
		const result = parseContributionHtml(loadGithubFixture("contributions-private-visible.html"));
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.value.some((day) => day.level > 0)).toBe(true);
		}
	});

	it("parses future cells but does not treat them as current activity", () => {
		const parsed = parseContributionHtml(loadGithubFixture("contributions-future-days.html"));
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) {
			return;
		}

		expect(parsed.value.map((day) => day.date)).toContain("2099-01-01");
		expect(excludeFutureContributionDays(parsed.value, "2026-09-08")).toEqual([
			{ date: "2026-09-08", level: 1 },
		]);
	});

	it("tolerates attribute order, whitespace, and quote style", () => {
		const result = parseContributionHtml(loadGithubFixture("contributions-attribute-order.html"));
		expect(result).toEqual({
			ok: true,
			value: [
				{ date: "2026-01-15", level: 3 },
				{ date: "2026-01-16", level: 1 },
				{ date: "2026-01-17", level: 4 },
			],
		});
	});

	it("does not treat malformed HTML or missing cells as zero activity", () => {
		const result = parseContributionHtml(loadGithubFixture("contributions-malformed.html"));
		expect(result).toEqual({
			ok: false,
			error: { type: "contribution_parse_failed" },
		});
	});

	it("ignores unrelated nodes and invalid levels", () => {
		const html = `
			<td class="other">nope</td>
			<td data-date="2026-09-08" data-level="2"></td>
			<td data-date="2026-09-08" data-level="not-a-level"></td>
		`;
		expect(parseContributionHtml(html)).toEqual({
			ok: true,
			value: [{ date: "2026-09-08", level: 2 }],
		});
	});
});
