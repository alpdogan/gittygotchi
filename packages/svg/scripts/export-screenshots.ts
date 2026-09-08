import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderErrorSvg } from "../src/error-svg.ts";
import {
	renderBehaviorScreenshot,
	renderClassScreenshot,
	renderHungerScreenshot,
	renderMoodScreenshot,
	renderStageClassScreenshot,
	renderStageScreenshot,
	SCREENSHOT_BEHAVIORS,
	SCREENSHOT_CLASSES,
	SCREENSHOT_HUNGERS,
	SCREENSHOT_MOODS,
	SCREENSHOT_STAGES,
} from "../src/samples.ts";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../../../docs/screenshots");
const gridDir = join(outDir, "grid");

mkdirSync(gridDir, { recursive: true });

for (const stage of SCREENSHOT_STAGES) {
	writeFileSync(join(outDir, `stage-${stage}.svg`), `${renderStageScreenshot(stage)}\n`);
}

for (const gittyClass of SCREENSHOT_CLASSES) {
	writeFileSync(join(outDir, `class-${gittyClass}.svg`), `${renderClassScreenshot(gittyClass)}\n`);
}

for (const mood of SCREENSHOT_MOODS) {
	writeFileSync(join(outDir, `mood-${mood}.svg`), `${renderMoodScreenshot(mood)}\n`);
}

for (const hunger of SCREENSHOT_HUNGERS) {
	writeFileSync(join(outDir, `hunger-${hunger}.svg`), `${renderHungerScreenshot(hunger)}\n`);
}

for (const behavior of SCREENSHOT_BEHAVIORS) {
	writeFileSync(
		join(outDir, `behavior-${behavior}.svg`),
		`${renderBehaviorScreenshot(behavior)}\n`,
	);
}

for (const stage of SCREENSHOT_STAGES) {
	for (const gittyClass of SCREENSHOT_CLASSES) {
		writeFileSync(
			join(gridDir, `${stage}-${gittyClass}.svg`),
			`${renderStageClassScreenshot(stage, gittyClass)}\n`,
		);
	}
}

writeFileSync(
	join(outDir, "error-hiding.svg"),
	`${renderErrorSvg({ kind: "invalid_username", username: "nope" })}\n`,
);

function figures(items: { src: string; label: string }[]): string {
	return items
		.map(
			(item) =>
				`<figure><img src="${item.src}" alt="${item.label}"><figcaption>${item.label}</figcaption></figure>`,
		)
		.join("");
}

function row(items: { src: string; label: string }[]): string {
	return `<div class="row">${figures(items)}</div>`;
}

function galleryPanel(): string {
	const stages = SCREENSHOT_STAGES.map((stage) => ({ src: `stage-${stage}.svg`, label: stage }));
	const classes = SCREENSHOT_CLASSES.map((gittyClass) => ({
		src: `class-${gittyClass}.svg`,
		label: gittyClass,
	}));
	const moods = SCREENSHOT_MOODS.map((mood) => ({ src: `mood-${mood}.svg`, label: mood }));
	const hungers = SCREENSHOT_HUNGERS.map((hunger) => ({
		src: `hunger-${hunger}.svg`,
		label: hunger,
	}));
	const behaviors = SCREENSHOT_BEHAVIORS.map((behavior) => ({
		src: `behavior-${behavior}.svg`,
		label: behavior,
	}));
	const grid = SCREENSHOT_STAGES.map(
		(stage) => `
		<h3>${stage}</h3>
		${row(
			SCREENSHOT_CLASSES.map((gittyClass) => ({
				src: `grid/${stage}-${gittyClass}.svg`,
				label: gittyClass,
			})),
		)}`,
	).join("");

	return `
		<h2>Stages</h2>
		${row(stages)}
		<h2>Classes (adult)</h2>
		${row(classes)}
		<h2>Moods (adult earth)</h2>
		${row(moods)}
		<h2>Hunger (adult earth)</h2>
		${row(hungers)}
		<h2>Behaviors (adult earth)</h2>
		${row(behaviors)}
		<h2>Stage × class</h2>
		${grid}
		<h2>Error</h2>
		<figure><img class="large" src="error-hiding.svg" alt="error"><figcaption>invalid username</figcaption></figure>`;
}

const gallery = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>GittyGotchi visual QA</title>
	<style>
		:root { font-family: ui-sans-serif, system-ui, sans-serif; }
		body { margin: 0; }
		section { padding: 1.5rem; }
		.light { background: #ffffff; color: #1f2328; }
		.dark { background: #0d1117; color: #f0f6fc; }
		h1 { font-size: 1.2rem; }
		h2 { font-size: 1.05rem; margin-top: 1.5rem; }
		h3 { font-size: 0.9rem; margin: 0.75rem 0 0.35rem; font-weight: 600; }
		.row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: end; }
		figure { margin: 0; text-align: center; }
		figcaption { font-size: 0.8rem; margin-top: 0.25rem; }
		img { width: 120px; height: 120px; display: block; }
		img.large { width: 240px; height: 240px; }
	</style>
</head>
<body>
	<section class="light">
		<h1>GitHub light (#ffffff)</h1>
		${galleryPanel()}
	</section>
	<section class="dark">
		<h1>GitHub dark (#0d1117)</h1>
		${galleryPanel()}
	</section>
</body>
</html>
`;

writeFileSync(join(outDir, "gallery.html"), gallery);
