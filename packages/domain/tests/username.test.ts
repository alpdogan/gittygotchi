import { describe, expect, it } from "vitest";
import { parseGitHubUsername } from "../src/username.ts";

describe("parseGitHubUsername", () => {
	it("accepts a valid username and normalizes case", () => {
		expect(parseGitHubUsername("AlpDogan")).toEqual({
			ok: true,
			username: "alpdogan",
		});
	});

	it("accepts the minimum and maximum lengths", () => {
		expect(parseGitHubUsername("a").ok).toBe(true);
		expect(parseGitHubUsername("a".repeat(39)).ok).toBe(true);
	});

	it("accepts internal hyphens", () => {
		expect(parseGitHubUsername("octo-cat").ok).toBe(true);
	});

	it("rejects empty, padded, and oversized values", () => {
		expect(parseGitHubUsername("").ok).toBe(false);
		expect(parseGitHubUsername("   ").ok).toBe(false);
		expect(parseGitHubUsername("a".repeat(40)).ok).toBe(false);
	});

	it("rejects hyphens at the edges and consecutive hyphens", () => {
		expect(parseGitHubUsername("-octocat").ok).toBe(false);
		expect(parseGitHubUsername("octocat-").ok).toBe(false);
		expect(parseGitHubUsername("octo--cat").ok).toBe(false);
	});

	it("rejects URLs, path separators, and query syntax", () => {
		expect(parseGitHubUsername("https://github.com/alpdogan").ok).toBe(false);
		expect(parseGitHubUsername("alpdogan/repo").ok).toBe(false);
		expect(parseGitHubUsername("alpdogan?tab=repositories").ok).toBe(false);
		expect(parseGitHubUsername("../etc").ok).toBe(false);
		expect(parseGitHubUsername("github.com").ok).toBe(false);
	});
});
