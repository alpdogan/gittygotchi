import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderErrorSvg } from "../src/error-svg.ts";
import {
	renderClassScreenshot,
	renderStageScreenshot,
	SCREENSHOT_CLASSES,
	SCREENSHOT_STAGES,
} from "../src/samples.ts";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../../../docs/screenshots");

mkdirSync(outDir, { recursive: true });

for (const stage of SCREENSHOT_STAGES) {
	writeFileSync(join(outDir, `stage-${stage}.svg`), `${renderStageScreenshot(stage)}\n`);
}

for (const gittyClass of SCREENSHOT_CLASSES) {
	writeFileSync(join(outDir, `class-${gittyClass}.svg`), `${renderClassScreenshot(gittyClass)}\n`);
}

writeFileSync(
	join(outDir, "error-hiding.svg"),
	`${renderErrorSvg({ kind: "invalid_username", username: "nope" })}\n`,
);

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
		h1, h2 { font-size: 1.1rem; }
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
		<h2>Stages</h2>
		<div class="row">
			${SCREENSHOT_STAGES.map((stage) => `<figure><img src="stage-${stage}.svg" alt="${stage}"><figcaption>${stage}</figcaption></figure>`).join("")}
		</div>
		<h2>Classes (adult)</h2>
		<div class="row">
			${SCREENSHOT_CLASSES.map((gittyClass) => `<figure><img src="class-${gittyClass}.svg" alt="${gittyClass}"><figcaption>${gittyClass}</figcaption></figure>`).join("")}
		</div>
		<h2>Error</h2>
		<figure><img class="large" src="error-hiding.svg" alt="error"><figcaption>invalid username</figcaption></figure>
	</section>
	<section class="dark">
		<h1>GitHub dark (#0d1117)</h1>
		<h2>Stages</h2>
		<div class="row">
			${SCREENSHOT_STAGES.map((stage) => `<figure><img src="stage-${stage}.svg" alt="${stage}"><figcaption>${stage}</figcaption></figure>`).join("")}
		</div>
		<h2>Classes (adult)</h2>
		<div class="row">
			${SCREENSHOT_CLASSES.map((gittyClass) => `<figure><img src="class-${gittyClass}.svg" alt="${gittyClass}"><figcaption>${gittyClass}</figcaption></figure>`).join("")}
		</div>
	</section>
</body>
</html>
`;

writeFileSync(join(outDir, "gallery.html"), gallery);
