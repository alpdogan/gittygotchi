import { describe, expect, it } from "vitest";
import { escapeXml, renderErrorSvg, renderPlaceholderGitty } from "../src/index.ts";

describe("escapeXml", () => {
	it("escapes markup and quotes", () => {
		expect(escapeXml(`<script alert("x")>'&`)).toBe(
			"&lt;script alert(&quot;x&quot;)&gt;&apos;&amp;",
		);
	});
});

describe("renderPlaceholderGitty", () => {
	it("returns a non-empty SVG with accessibility text", () => {
		const svg = renderPlaceholderGitty({ username: "alpdogan" });
		expect(svg.startsWith("<?xml")).toBe(true);
		expect(svg).toContain("<svg");
		expect(svg).toContain('role="img"');
		expect(svg).toContain("<title>");
		expect(svg).toContain("<desc>");
		expect(svg).toContain("@alpdogan");
		expect(svg.length).toBeGreaterThan(0);
	});

	it("escapes user-derived text", () => {
		const svg = renderPlaceholderGitty({ username: `foo</title><script>` });
		expect(svg).not.toContain("<script>");
		expect(svg).toContain("&lt;script&gt;");
	});
});

describe("renderErrorSvg", () => {
	it("returns a valid image-compatible SVG", () => {
		const svg = renderErrorSvg({ kind: "invalid_username", username: "nope" });
		expect(svg).toContain("<svg");
		expect(svg).toContain("Gitty is hiding.");
		expect(svg).not.toContain("stack");
	});
});
