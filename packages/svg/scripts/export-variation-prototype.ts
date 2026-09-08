import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BEHAVIOR_STATES, GROWTH_STAGES, HUNGER_STATES, MOOD_STATES } from "@gittygotchi/domain";
import {
	renderClassPrototype,
	renderPrototypeMatureSilhouette,
	renderPrototypeSilhouette,
	renderVariationPrototype,
} from "../src/prototype/renderer.ts";
import { PROTOTYPE_CLASSES, type PrototypeClass } from "../src/prototype/types.ts";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../../../docs/prototype");
const sectionDirs = ["stages", "matrix", "moods", "hunger", "behaviors"] as const;
const developedStages = GROWTH_STAGES.filter((stage) => stage !== "egg");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
for (const dir of sectionDirs) {
	mkdirSync(join(outDir, dir), { recursive: true });
}

function writeSvg(path: string, svg: string): number {
	const output = `${svg}\n`;
	writeFileSync(path, output);
	return Buffer.byteLength(output);
}

const classSizes = new Map<PrototypeClass, number>();
for (const gittyClass of PROTOTYPE_CLASSES) {
	classSizes.set(
		gittyClass,
		writeSvg(join(outDir, `${gittyClass}.svg`), renderClassPrototype(gittyClass)),
	);
}
writeSvg(join(outDir, "silhouette.svg"), renderPrototypeSilhouette());
writeSvg(join(outDir, "silhouette-mature.svg"), renderPrototypeMatureSilhouette());

for (const stage of GROWTH_STAGES) {
	writeSvg(
		join(outDir, "stages", `${stage}.svg`),
		renderVariationPrototype({ gittyClass: "earth", stage }),
	);
	if (stage !== "egg") {
		for (const gittyClass of PROTOTYPE_CLASSES) {
			writeSvg(
				join(outDir, "matrix", `${stage}-${gittyClass}.svg`),
				renderVariationPrototype({ gittyClass, stage }),
			);
		}
	}
}

for (const mood of MOOD_STATES) {
	writeSvg(
		join(outDir, "moods", `${mood}.svg`),
		renderVariationPrototype({ gittyClass: "earth", mood }),
	);
}

for (const hunger of HUNGER_STATES) {
	writeSvg(
		join(outDir, "hunger", `${hunger}.svg`),
		renderVariationPrototype({
			gittyClass: "earth",
			mood: "neutral",
			hunger,
		}),
	);
}

for (const behavior of BEHAVIOR_STATES) {
	writeSvg(
		join(outDir, "behaviors", `${behavior}.svg`),
		renderVariationPrototype({
			gittyClass: "earth",
			mood: behavior === "playing" ? "excited" : "neutral",
			behavior,
		}),
	);
}

type Card = { src: string; label: string; meta?: string };

function cards(items: Card[], className = "card-grid"): string {
	return `<div class="${className}">${items
		.map(
			({ src, label, meta }) => `
				<figure class="card">
					<img src="${src}" width="240" height="240" alt="${label}">
					<figcaption><strong>${label}</strong>${meta ? `<span>${meta}</span>` : ""}</figcaption>
				</figure>`,
		)
		.join("")}</div>`;
}

const classCards: Card[] = PROTOTYPE_CLASSES.map((gittyClass) => ({
	src: `${gittyClass}.svg`,
	label: gittyClass,
	meta: `${classSizes.get(gittyClass)} bytes`,
}));

const smallCards: Card[] = PROTOTYPE_CLASSES.map((gittyClass) => ({
	src: `${gittyClass}.svg`,
	label: gittyClass,
}));

const stageCards: Card[] = GROWTH_STAGES.map((stage) => ({
	src: `stages/${stage}.svg`,
	label: stage,
}));

const silhouetteCards: Card[] = [
	{ src: "silhouette.svg", label: "adult silhouette", meta: "canonical form" },
	{ src: "silhouette-mature.svg", label: "mature silhouette", meta: "final form" },
];

const moodCards: Card[] = MOOD_STATES.map((mood) => ({
	src: `moods/${mood}.svg`,
	label: mood,
}));

const hungerCards: Card[] = HUNGER_STATES.map((hunger) => ({
	src: `hunger/${hunger}.svg`,
	label: hunger.replaceAll("_", " "),
}));

const behaviorCards: Card[] = BEHAVIOR_STATES.map((behavior) => ({
	src: `behaviors/${behavior}.svg`,
	label: behavior,
}));

const adultMatureComparison = ["adult", "mature"]
	.map(
		(stage) => `
		<h3>${stage} class effects</h3>
		${cards(
			PROTOTYPE_CLASSES.map((gittyClass) => ({
				src: `matrix/${stage}-${gittyClass}.svg`,
				label: `${stage} ${gittyClass}`,
				meta: stage === "adult" ? "moderate tier" : "adult + mature tiers",
			})),
		)}`,
	)
	.join("");

const matrix = developedStages
	.map(
		(stage) => `
		<h3>${stage}</h3>
		${cards(
			PROTOTYPE_CLASSES.map((gittyClass) => ({
				src: `matrix/${stage}-${gittyClass}.svg`,
				label: gittyClass,
			})),
		)}`,
	)
	.join("");

writeFileSync(
	join(outDir, "index.html"),
	`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>GittyGotchi visual variation prototype</title>
	<style>
		:root { color-scheme: dark; font-family: ui-sans-serif, system-ui, sans-serif; }
		* { box-sizing: border-box; }
		html { scroll-behavior: smooth; }
		body { margin: 0; background: #0d1725; color: #eef4fa; }
		main { width: min(1440px, 100%); margin: auto; padding: 38px 28px 70px; }
		header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 24px; }
		h1 { margin: 0; font-size: clamp(1.7rem, 4vw, 2.8rem); letter-spacing: -.035em; }
		h2 { margin: 44px 0 14px; font-size: 1.25rem; }
		h3 { margin: 26px 0 10px; text-transform: capitalize; color: #8bd8e8; font-size: 1rem; }
		p { margin: 8px 0 0; color: #aebdd0; max-width: 760px; line-height: 1.5; }
		nav { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 0; background: color-mix(in srgb, #0d1725 92%, transparent); backdrop-filter: blur(10px); }
		nav a { color: #aebdd0; text-decoration: none; border: 1px solid #293a50; border-radius: 999px; padding: 6px 10px; font-size: .82rem; }
		.badge { color: #8bd8e8; border: 1px solid #36516a; border-radius: 999px; padding: 8px 12px; white-space: nowrap; }
		.card-grid { display: grid; grid-template-columns: repeat(5, minmax(170px, 1fr)); gap: 14px; }
		.card { margin: 0; background: #152235; border: 1px solid #293a50; border-radius: 17px; padding: 12px; }
		.card img { display: block; width: 100%; height: auto; border-radius: 12px; }
		figcaption { text-transform: capitalize; margin-top: 9px; display: flex; justify-content: space-between; gap: 8px; color: #c9d5e3; font-size: .88rem; }
		figcaption span { color: #7f91a8; font-size: .76rem; align-self: center; }
		.small-grid { display: flex; flex-wrap: wrap; gap: 12px; }
		.small-grid .card { padding: 9px; }
		.small-grid .card img { width: 128px; height: 128px; }
		.small-grid figcaption { justify-content: center; }
		@media (max-width: 1050px) { .card-grid { grid-template-columns: repeat(3, 1fr); } }
		@media (max-width: 680px) {
			main { padding: 24px 16px 48px; }
			header { align-items: start; flex-direction: column; }
			.card-grid { grid-template-columns: 1fr 1fr; }
		}
		@media (max-width: 440px) { .card-grid { grid-template-columns: 1fr; } }
	</style>
</head>
<body>
	<main>
		<header>
			<div>
				<h1>Gitty variation prototype</h1>
				<p>Class-approved shared species system expanded into growth, expression, hunger, and behavior examples. Still isolated from the production renderer.</p>
			</div>
			<div class="badge">Example gallery</div>
		</header>
		<nav>
			<a href="#classes">Classes</a><a href="#sizes">128px</a><a href="#silhouettes">Silhouettes</a><a href="#stages">Growth</a>
			<a href="#moods">Moods</a><a href="#hunger">Hunger</a><a href="#behaviors">Behaviors</a>
			<a href="#effect-progression">Effects</a><a href="#matrix">Stage × class</a>
		</nav>

		<section id="classes"><h2>Adult + Happy classes</h2>${cards(classCards)}</section>
		<section id="sizes"><h2>128px readability</h2>${cards(smallCards, "small-grid")}</section>
		<section id="silhouettes">
			<h2>Adult → Mature silhouettes · 128px</h2>
			<p>Mature keeps the Gitty spiral tail, asymmetric ears, cheek contour, compact torso, and paws while developing a fuller final-form stance with compact ribbon-leaf wings.</p>
			${cards(silhouetteCards, "small-grid")}
		</section>
		<section id="stages"><h2>Growth stages · Neutral egg, then Earth</h2>${cards(stageCards)}</section>
		<section id="moods"><h2>Moods · Adult Earth</h2>${cards(moodCards)}</section>
		<section id="hunger"><h2>Hunger · Adult Earth</h2>${cards(hungerCards)}</section>
		<section id="behaviors"><h2>Behaviors · Adult Earth</h2>${cards(behaviorCards)}</section>
		<section id="effect-progression">
			<h2>Adult → Mature anatomy and effect progression</h2>
			<p>Adult remains the canonical mid-final form. Mature adds hand-authored final-form anatomy with shared fantasy wings, a developed forehead motif, the richest surface markings, and a composable second effect tier; Baby and Young remain surface-only.</p>
			${adultMatureComparison}
		</section>
		<section id="matrix"><h2>Stage × class matrix</h2>${matrix}</section>
	</main>
</body>
</html>
`,
);
