import {
	BEHAVIOR_STATES,
	GITTY_CLASSES,
	GROWTH_STAGES,
	HUNGER_STATES,
	MOOD_STATES,
	type VisiblePetState,
} from "@gittygotchi/domain";
import { describe, expect, it } from "vitest";
import { escapeXml, renderErrorSvg, renderGitty, resolveFace } from "../src/index.ts";

function state(overrides: Partial<VisiblePetState> = {}): VisiblePetState {
	return {
		gittyClass: "earth",
		growthStage: "hatchling",
		hunger: "normal",
		mood: "neutral",
		behavior: "idle",
		...overrides,
	};
}

describe("escapeXml", () => {
	it("escapes markup and quotes", () => {
		expect(escapeXml(`<script alert("x")>'&`)).toBe(
			"&lt;script alert(&quot;x&quot;)&gt;&apos;&amp;",
		);
	});
});

describe("resolveFace", () => {
	it("maps Phase 5 faces from independent dimensions", () => {
		expect(resolveFace(state({ behavior: "sleeping" }))).toBe("sleeping");
		expect(resolveFace(state({ hunger: "hungry" }))).toBe("hungry");
		expect(resolveFace(state({ mood: "happy" }))).toBe("happy");
		expect(resolveFace(state())).toBe("neutral");
	});
});

describe("renderGitty", () => {
	it("returns a non-empty accessible SVG", () => {
		const svg = renderGitty({ username: "alpdogan", state: state({ growthStage: "egg" }) });
		expect(svg.startsWith("<?xml")).toBe(true);
		expect(svg).toContain("<svg");
		expect(svg).toContain('role="img"');
		expect(svg).toContain("<title>");
		expect(svg).toContain("<desc>");
		expect(svg).toContain("@alpdogan");
		expect(svg).toContain('data-gitty-stage="egg"');
		expect(svg).toMatch(
			/<g transform="translate\(120 150\) scale\([^)]+\) translate\(-120 -150\)">\s*<g class="gitty-idle">/,
		);
		expect(svg).not.toContain("XP");
		expect(svg).not.toContain("Level");
		expect(svg.length).toBeGreaterThan(0);
	});

	it("escapes user-derived text", () => {
		const svg = renderGitty({
			username: `foo</title><script>`,
			state: state({ growthStage: "egg" }),
		});
		expect(svg).not.toContain("<script>");
		expect(svg).toContain("&lt;script&gt;");
	});

	it("renders every class, stage, hunger, mood, and behavior as valid SVG", () => {
		for (const gittyClass of GITTY_CLASSES) {
			for (const growthStage of GROWTH_STAGES) {
				for (const hunger of HUNGER_STATES) {
					for (const mood of MOOD_STATES) {
						for (const behavior of BEHAVIOR_STATES) {
							const svg = renderGitty({
								username: "octocat",
								state: { gittyClass, growthStage, hunger, mood, behavior },
							});
							expect(svg).toContain("<svg");
							expect(svg).toContain(`data-gitty-class="${gittyClass}"`);
							expect(svg.length).toBeGreaterThan(200);
						}
					}
				}
			}
		}
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
