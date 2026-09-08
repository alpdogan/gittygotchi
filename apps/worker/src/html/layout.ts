import { GITHUB_REPO_URL } from "@gittygotchi/config";
import { copyEnhancementScript } from "./copy-script.ts";
import { escapeHtml } from "./escape.ts";

export function renderPage(options: { title: string; description: string; body: string }): string {
	const title = escapeHtml(options.title);
	const description = escapeHtml(options.description);

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<meta name="description" content="${description}">
	<style>
		:root {
			--paper: #f3ead7;
			--ink: #24180f;
			--muted: #6b5344;
			--line: #d8c7a6;
			--accent: #b3471d;
			--leaf: #3f6b45;
			--card: #fff8ea;
		}
		* { box-sizing: border-box; }
		body {
			margin: 0;
			color: var(--ink);
			background:
				radial-gradient(circle at 12% 8%, #fbf4e4 0, transparent 28%),
				var(--paper);
			font-family: "Avenir Next", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
			line-height: 1.5;
		}
		main {
			max-width: 44rem;
			margin: 0 auto;
			padding: 2.5rem 1.25rem 4rem;
		}
		h1, h2, h3 {
			font-family: "Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif;
			letter-spacing: -0.02em;
		}
		h1 { font-size: 2.4rem; margin: 0 0 0.4rem; }
		h2 { font-size: 1.35rem; margin: 2.4rem 0 0.7rem; }
		p { margin: 0.5rem 0; }
		.lede { font-size: 1.15rem; }
		.muted { color: var(--muted); }
		a { color: var(--leaf); }
		.card {
			background: var(--card);
			border: 1px solid var(--line);
			border-radius: 1.1rem;
			padding: 1rem;
			margin: 1rem 0;
		}
		.gitty-frame {
			display: block;
			width: min(100%, 240px);
			height: auto;
			margin: 0.8rem 0;
		}
		.gitty-frame.large { width: min(100%, 320px); }
		label { display: block; font-size: 0.92rem; margin-bottom: 0.35rem; }
		input, textarea {
			width: 100%;
			border: 1px solid var(--line);
			border-radius: 0.7rem;
			padding: 0.7rem 0.8rem;
			font: inherit;
			background: #fff;
			color: var(--ink);
		}
		textarea { min-height: 5.4rem; resize: vertical; }
		.row { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.7rem; }
		button, .button {
			appearance: none;
			border: 0;
			border-radius: 999px;
			padding: 0.65rem 1rem;
			background: var(--accent);
			color: #fff8ea;
			font: inherit;
			cursor: pointer;
			text-decoration: none;
			display: inline-block;
		}
		button.secondary, .button.secondary {
			background: transparent;
			color: var(--ink);
			border: 1px solid var(--line);
		}
		ol { padding-left: 1.2rem; }
		.classes { display: flex; flex-wrap: wrap; gap: 0.5rem; }
		.chip {
			border: 1px solid var(--line);
			border-radius: 999px;
			padding: 0.25rem 0.7rem;
			background: #fff;
			font-size: 0.92rem;
		}
		footer {
			margin-top: 3rem;
			color: var(--muted);
			font-size: 0.92rem;
		}
	</style>
</head>
<body>
	<main>
		${options.body}
		<footer>
			<p>GittyGotchi is open source at <a href="${GITHUB_REPO_URL}">${escapeHtml(GITHUB_REPO_URL)}</a>.</p>
			<p>No login. No token. Just add your Gitty.</p>
		</footer>
	</main>
	${copyEnhancementScript()}
</body>
</html>`;
}
