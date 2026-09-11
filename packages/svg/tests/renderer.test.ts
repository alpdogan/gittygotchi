import {
	BEHAVIOR_STATES,
	GITTY_CLASSES,
	GROWTH_STAGES,
	HUNGER_STATES,
	MOOD_STATES,
	type VisiblePetState,
} from "@gittygotchi/domain";
import { describe, expect, it } from "vitest";
import {
	CARD_FILL,
	CARD_STROKE,
	escapeXml,
	FACE_KINDS,
	FOUNDATION_PREVIEW_STATE,
	PREVIEW_EGG_STATE,
	renderErrorSvg,
	renderGitty,
	resolveFace,
} from "../src/index.ts";

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
	it("maps sleep, hunger, then mood onto distinct faces", () => {
		expect(resolveFace(state({ behavior: "sleeping" }))).toBe("sleeping");
		expect(resolveFace(state({ behavior: "hibernating", mood: "happy" }))).toBe("sleeping");
		expect(resolveFace(state({ hunger: "hungry" }))).toBe("hungry");
		expect(resolveFace(state({ hunger: "very_hungry", mood: "sad" }))).toBe("hungry");
		expect(resolveFace(state({ mood: "sad" }))).toBe("sad");
		expect(resolveFace(state({ mood: "grumpy" }))).toBe("grumpy");
		expect(resolveFace(state({ mood: "excited" }))).toBe("excited");
		expect(resolveFace(state({ mood: "happy" }))).toBe("happy");
		expect(resolveFace(state())).toBe("neutral");
	});
});

describe("renderGitty", () => {
	it("uses adult happy Earth as the HTTP preview", () => {
		expect(FOUNDATION_PREVIEW_STATE).toEqual({
			gittyClass: "earth",
			growthStage: "adult",
			hunger: "normal",
			mood: "happy",
			behavior: "idle",
		});
		const svg = renderGitty({
			username: "alpdogan",
			state: FOUNDATION_PREVIEW_STATE,
			preview: true,
		});
		expect(svg).toContain('data-gitty-stage="adult"');
		expect(svg).toContain("earth-leaf");
		expect(svg).toContain("A preview adult Gitty");
	});

	it("keeps an egg preview state for first-visit fallbacks", () => {
		expect(PREVIEW_EGG_STATE).toEqual({
			gittyClass: "earth",
			growthStage: "egg",
			hunger: "normal",
			mood: "happy",
			behavior: "idle",
		});
		const svg = renderGitty({ username: "alpdogan", state: PREVIEW_EGG_STATE });
		expect(svg).toContain('data-gitty-stage="egg"');
		expect(svg).toContain('data-prototype-class="unrevealed"');
		expect(svg).not.toContain("Gitty is hiding.");
	});

	it("returns a compact accessible SVG from the approved prototype", () => {
		const svg = renderGitty({ username: "alpdogan", state: state({ growthStage: "egg" }) });
		expect(svg.startsWith("<?xml")).toBe(true);
		expect(svg).toContain("<svg");
		expect(svg).toContain('role="img"');
		expect(svg).toContain("<title>");
		expect(svg).toContain("<desc>");
		expect(svg).toContain("@alpdogan");
		expect(svg).toContain('data-gitty-stage="egg"');
		expect(svg).toContain('data-gitty-body="egg"');
		expect(svg).toContain('data-prototype-stage="egg"');
		expect(svg).toContain("stage-egg");
		expect(svg).toContain('fill="#f3ead7"');
		expect(svg).not.toContain('class="gitty-ears"');
		expect(svg).not.toContain("XP");
		expect(svg).not.toContain("Level");
		expect(svg.length).toBeGreaterThan(0);
		expect(svg.length).toBeLessThan(16_000);
		expect(svg.includes("\n\t")).toBe(false);
	});

	it("escapes user-derived text", () => {
		const svg = renderGitty({
			username: `foo</title><script>`,
			state: state({ growthStage: "egg" }),
		});
		expect(svg).not.toContain("<script>");
		expect(svg).toContain("&lt;script&gt;");
	});

	it("gives every growth stage a distinct silhouette", () => {
		const bodies = GROWTH_STAGES.map((growthStage) => {
			const svg = renderGitty({
				username: "octocat",
				state: state({ growthStage }),
			});
			const body = /data-gitty-body="([^"]+)"/.exec(svg)?.[1];
			expect(body).toBe(growthStage);
			return svg.replace(/data-gitty-stage="[^"]+"/g, "").replace(/data-gitty-body="[^"]+"/g, "");
		});
		expect(new Set(bodies).size).toBe(GROWTH_STAGES.length);
	});

	it("escalates class traits after the egg", () => {
		const waterEgg = renderGitty({
			username: "octocat",
			state: state({ gittyClass: "water", growthStage: "egg" }),
		});
		const waterAdult = renderGitty({
			username: "octocat",
			state: state({ gittyClass: "water", growthStage: "adult" }),
		});
		expect(waterEgg).not.toContain("water-bubble");
		expect(waterAdult).toContain("water-bubble");
		expect(waterAdult.match(/water-bubble/g)?.length ?? 0).toBeGreaterThan(0);

		const earthMature = renderGitty({
			username: "octocat",
			state: state({ gittyClass: "earth", growthStage: "mature" }),
		});
		expect(earthMature).toContain("earth-leaf");
		expect(earthMature).toContain("mature-forehead-echo");

		const fireMature = renderGitty({
			username: "octocat",
			state: state({ gittyClass: "fire", growthStage: "mature" }),
		});
		expect((fireMature.match(/fire-flame/g)?.length ?? 0) > 1).toBe(true);

		const psyAdult = renderGitty({
			username: "octocat",
			state: state({ gittyClass: "psy", growthStage: "adult" }),
		});
		expect(psyAdult).toContain("psy-particle");
		expect(psyAdult).toContain('class="class-psy');
	});

	it("renders every listed face kind", () => {
		const faces = new Set(
			FACE_KINDS.map((moodFace) => {
				const svg = renderGitty({
					username: "octocat",
					state: state({
						growthStage: "adult",
						hunger: moodFace === "hungry" ? "hungry" : "normal",
						mood:
							moodFace === "sad"
								? "sad"
								: moodFace === "grumpy"
									? "grumpy"
									: moodFace === "excited"
										? "excited"
										: moodFace === "happy"
											? "happy"
											: "neutral",
						behavior: moodFace === "sleeping" ? "sleeping" : "idle",
					}),
				});
				expect(svg).toContain(`data-gitty-face="${moodFace}"`);
				return moodFace;
			}),
		);
		expect(faces.size).toBe(FACE_KINDS.length);
	});

	it("nests ear and tail motion so CSS cannot clobber placement", () => {
		const svg = renderGitty({
			username: "octocat",
			state: state({ growthStage: "adult", behavior: "playing" }),
		});
		expect(svg).toContain('class="class-earth behavior-playing"');
		expect(svg).toContain('class="gitty-tail"');
		expect(svg).toContain('class="gitty-ears"');
		expect(svg).not.toMatch(/class="gitty-ears" transform=/);
		expect(svg).not.toMatch(/class="gitty-tail" transform=/);
	});

	it("keeps the ground shadow outside character motion", () => {
		const svg = renderGitty({
			username: "octocat",
			state: state({ growthStage: "adult", behavior: "idle" }),
		});
		const shadowAt = svg.indexOf('class="gitty-shadow"');
		const characterAt = svg.indexOf('class="gitty-character"');
		expect(shadowAt).toBeGreaterThan(-1);
		expect(characterAt).toBeGreaterThan(shadowAt);
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
							expect(svg).toContain(`data-gitty-body="${growthStage}"`);
							expect(svg.length).toBeGreaterThan(200);
							expect(svg.length).toBeLessThan(16_000);
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
		expect(svg).toContain(`fill="${CARD_FILL}"`);
		expect(svg).toContain(`stroke="${CARD_STROKE}"`);
		expect(svg).not.toContain("stack");
	});
});
