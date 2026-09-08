import { BEHAVIOR_STATES, GROWTH_STAGES, HUNGER_STATES, MOOD_STATES } from "@gittygotchi/domain";
import { describe, expect, it } from "vitest";
import {
	renderClassPrototype,
	renderPrototypeMatureSilhouette,
	renderPrototypeSilhouette,
	renderVariationPrototype,
} from "../src/prototype/renderer.ts";
import { PROTOTYPE_CLASSES } from "../src/prototype/types.ts";

describe("class visual prototype", () => {
	it("renders five standalone animated SVGs without JavaScript", () => {
		for (const gittyClass of PROTOTYPE_CLASSES) {
			const svg = renderClassPrototype(gittyClass);
			expect(svg).toMatch(/^<\?xml/);
			expect(svg).toContain('viewBox="0 0 240 240"');
			expect(svg).toContain('role="img"');
			expect(svg).toContain("<title>");
			expect(svg).toContain("<desc>");
			expect(svg).toContain(`<g class="class-${gittyClass} behavior-idle">`);
			expect(svg).toContain("@keyframes");
			expect(svg).not.toContain("<script");
			expect(svg).not.toContain("<image");
			expect(svg.length).toBeLessThan(15_000);
		}
	});

	it("uses identical signature anatomy paths for every class", () => {
		const anatomySignatures = PROTOTYPE_CLASSES.map((gittyClass) => {
			const svg = renderClassPrototype(gittyClass);
			return {
				tail: svg.match(/data-anatomy-part="tail" d="([^"]+)"/)?.[1],
				body: svg.match(/data-anatomy-part="body" d="([^"]+)"/)?.[1],
				head: svg.match(/data-anatomy-part="head" d="([^"]+)"/)?.[1],
			};
		});

		expect(anatomySignatures.every(({ tail, body, head }) => tail && body && head)).toBe(true);
		expect(new Set(anatomySignatures.map(({ tail }) => tail)).size).toBe(1);
		expect(new Set(anatomySignatures.map(({ body }) => body)).size).toBe(1);
		expect(new Set(anatomySignatures.map(({ head }) => head)).size).toBe(1);
	});

	it("keeps class effects distinct and includes a black silhouette", () => {
		expect(renderClassPrototype("earth")).toContain("earth-leaf-drift");
		expect(renderClassPrototype("water")).toContain("water-bubble-rise");
		expect(renderClassPrototype("air")).toContain("air-spark");
		expect(renderClassPrototype("fire")).toContain("fire-flicker");
		expect(renderClassPrototype("psy")).toContain("psy-particle");

		const silhouette = renderPrototypeSilhouette();
		expect(silhouette).toContain("Gitty silhouette prototype");
		expect(silhouette).not.toContain("<style>");
		expect(silhouette).not.toContain("<ellipse");
	});

	it("renders one neutral unrevealed egg for every requested class", () => {
		const eggs = PROTOTYPE_CLASSES.map((gittyClass) =>
			renderVariationPrototype({ gittyClass, stage: "egg" }),
		);

		expect(new Set(eggs).size).toBe(1);
		for (const egg of eggs) {
			expect(egg).toContain('data-prototype-class="unrevealed"');
			expect(egg).toContain('data-prototype-stage="egg"');
			expect(egg).toContain("<title>Unrevealed Gitty egg prototype</title>");
			expect(egg).toContain("Neutral unrevealed Gitty egg");
			expect(egg).toContain('fill="#f3ead7"');
			expect(egg).not.toMatch(
				/class-(earth|water|air|fire|psy)|earth-leaf|water-bubble|water-droplet|air-wind|air-spark|fire-flame|fire-ember|fire-flicker|psy-particle|psy-levitat/,
			);
			expect(egg).not.toContain("<style>");
		}
	});

	it("renders every developed stage and class combination distinctly", () => {
		const developedStages = GROWTH_STAGES.filter((stage) => stage !== "egg");
		const anatomyByStage = new Map<string, string>();

		for (const stage of developedStages) {
			const variants = PROTOTYPE_CLASSES.map((gittyClass) => {
				const svg = renderVariationPrototype({ gittyClass, stage });
				expect(svg).toContain(`data-prototype-stage="${stage}"`);
				expect(svg).toContain(`data-prototype-class="${gittyClass}"`);
				expect(svg).toContain(`stage-${stage}`);
				const signature = [...svg.matchAll(/data-anatomy-part="[^"]+" d="([^"]+)"/g)]
					.map((match) => match[1])
					.join("|");
				expect(signature).not.toBe("");
				anatomyByStage.set(`${stage}-${gittyClass}`, signature);
				return svg;
			});

			expect(new Set(variants).size).toBe(PROTOTYPE_CLASSES.length);
			expect(
				new Set(PROTOTYPE_CLASSES.map((gittyClass) => anatomyByStage.get(`${stage}-${gittyClass}`)))
					.size,
			).toBe(1);
		}

		const earthStageSignatures = developedStages.map((stage) =>
			anatomyByStage.get(`${stage}-earth`),
		);
		expect(new Set(earthStageSignatures).size).toBe(developedStages.length);
	});

	it("gives Mature a shared, materially different final-form anatomy", () => {
		const anatomyParts = ["tail", "body", "head", "left-ear", "right-ear", "left-paw", "right-paw"];
		const anatomy = (svg: string) =>
			new Map(
				[...svg.matchAll(/data-anatomy-part="([^"]+)" d="([^"]+)"/g)].map((match) => [
					match[1],
					match[2],
				]),
			);
		const adult = anatomy(renderVariationPrototype({ gittyClass: "earth", stage: "adult" }));
		const matureByClass = PROTOTYPE_CLASSES.map((gittyClass) =>
			anatomy(renderVariationPrototype({ gittyClass, stage: "mature" })),
		);

		for (const part of anatomyParts) {
			expect(matureByClass[0]?.get(part)).not.toBe(adult.get(part));
			expect(new Set(matureByClass.map((paths) => paths.get(part))).size).toBe(1);
		}

		const adultSvg = renderVariationPrototype({ gittyClass: "earth", stage: "adult" });
		const matureSvg = renderVariationPrototype({ gittyClass: "earth", stage: "mature" });
		expect(adultSvg).not.toContain("mature-forehead-echo");
		expect(matureSvg).toContain("mature-forehead-echo");

		const adultSilhouette = renderPrototypeSilhouette();
		const matureSilhouette = renderPrototypeMatureSilhouette();
		expect(matureSilhouette).toContain('data-prototype-stage="mature"');
		expect(matureSilhouette).not.toBe(adultSilhouette);
		expect(matureSilhouette).not.toContain("<style>");
	});

	it("adds one shared pair of fantasy wings only to Mature", () => {
		const wingParts = ["left-wing", "right-wing", "left-wing-accent", "right-wing-accent"];

		for (const stage of GROWTH_STAGES.filter((stage) => stage !== "mature")) {
			for (const gittyClass of PROTOTYPE_CLASSES) {
				const svg = renderVariationPrototype({ gittyClass, stage });
				expect(svg).not.toContain('data-anatomy-feature="mature-wings"');
				expect(svg).not.toMatch(/data-anatomy-part="(?:left|right)-wing/);
			}
		}

		const matureWings = PROTOTYPE_CLASSES.map((gittyClass) => {
			const svg = renderVariationPrototype({ gittyClass, stage: "mature" });
			expect(svg).toContain('data-anatomy-feature="mature-wings"');
			return new Map(
				[...svg.matchAll(/data-anatomy-part="([^"]*wing[^"]*)" d="([^"]+)"/g)].map((match) => [
					match[1],
					match[2],
				]),
			);
		});

		for (const part of wingParts) {
			expect(matureWings.every((wings) => wings.has(part))).toBe(true);
			expect(new Set(matureWings.map((wings) => wings.get(part))).size).toBe(1);
		}

		expect(renderPrototypeMatureSilhouette()).toContain('data-anatomy-feature="mature-wings"');
	});

	it("strengthens class markings as a Gitty develops", () => {
		const expectedOpacities = {
			hatchling: "0.42",
			baby: "0.58",
			young: "0.78",
			adult: "0.9",
			mature: "1",
		} as const;

		for (const [stage, opacity] of Object.entries(expectedOpacities)) {
			const svg = renderVariationPrototype({
				gittyClass: "earth",
				stage: stage as Exclude<(typeof GROWTH_STAGES)[number], "egg">,
			});
			expect(svg).toContain(
				`class="stage-class-markings stage-class-markings-${stage}" opacity="${opacity}"`,
			);
		}
	});

	it("keeps ambient class effects off until adulthood", () => {
		for (const stage of ["hatchling", "baby", "young"] as const) {
			for (const gittyClass of PROTOTYPE_CLASSES) {
				const svg = renderVariationPrototype({ gittyClass, stage });
				expect(svg).toContain('data-class-effect-level="none"');
				expect(svg).not.toContain("data-effect-element=");
				expect(svg).not.toContain("data-effect-tier=");
			}
		}
	});

	it("composes a visible mature effect tier on top of adult effects", () => {
		for (const gittyClass of PROTOTYPE_CLASSES) {
			const adult = renderVariationPrototype({ gittyClass, stage: "adult" });
			const mature = renderVariationPrototype({ gittyClass, stage: "mature" });
			const countEffects = (svg: string) => svg.match(/data-effect-element=/g)?.length ?? 0;

			expect(adult).toContain('data-class-effect-level="adult"');
			expect(adult).toContain('data-effect-tier="adult"');
			expect(adult).not.toContain('data-effect-tier="mature"');
			expect(mature).toContain('data-class-effect-level="mature"');
			expect(mature).toContain('data-effect-tier="adult"');
			expect(mature).toContain('data-effect-tier="mature"');
			expect(countEffects(mature)).toBeGreaterThan(countEffects(adult));
		}
	});

	it("renders every growth stage", () => {
		for (const stage of GROWTH_STAGES) {
			for (const gittyClass of PROTOTYPE_CLASSES) {
				const svg = renderVariationPrototype({ gittyClass, stage });
				expect(svg).toContain(`data-prototype-stage="${stage}"`);
				expect(svg).toContain(`stage-${stage}`);
			}
		}
	});

	it("renders composable mood, hunger, and behavior examples", () => {
		for (const mood of MOOD_STATES) {
			const svg = renderVariationPrototype({ gittyClass: "earth", mood });
			expect(svg).toContain(`data-prototype-mood="${mood}"`);
			expect(svg).toContain(`face-${mood}`);
		}

		for (const hunger of HUNGER_STATES) {
			const svg = renderVariationPrototype({ gittyClass: "earth", hunger });
			expect(svg).toContain(`data-prototype-hunger="${hunger}"`);
		}

		for (const behavior of BEHAVIOR_STATES) {
			const svg = renderVariationPrototype({ gittyClass: "earth", behavior });
			expect(svg).toContain(`data-prototype-behavior="${behavior}"`);
			expect(svg).toContain(`behavior-${behavior}`);
		}
	});
});
