export const PAGE_STYLES = `
:root {
	--paper: #f3ead7;
	--ink: #24180f;
	--muted: #6b5344;
	--line: #d8c7a6;
	--accent: #b3471d;
	--leaf: #3f6b45;
	--card: #fff8ea;
	--earth: #6f8f4e;
	--water: #3e9aab;
	--air: #6ea8d4;
	--fire: #e07a3d;
	--psy: #7b5ea7;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
	margin: 0;
	color: var(--ink);
	background:
		radial-gradient(circle at 12% 8%, #fbf4e4 0, transparent 28%),
		radial-gradient(circle at 88% 0%, #f7e4c8 0, transparent 26%),
		var(--paper);
	font-family: "Avenir Next", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
	line-height: 1.5;
}
.skip {
	position: absolute;
	left: -999px;
	top: 0;
	background: var(--ink);
	color: var(--card);
	padding: 0.5rem 0.8rem;
}
.skip:focus { left: 0.8rem; top: 0.8rem; z-index: 2; }
.site-header, main, .site-footer {
	width: min(52rem, calc(100% - 2rem));
	margin-left: auto;
	margin-right: auto;
}
.site-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1.2rem 0 0.4rem;
}
.wordmark {
	font-family: "Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif;
	font-weight: 700;
	font-size: 1.15rem;
	color: var(--ink);
	text-decoration: none;
}
.site-nav { display: flex; gap: 0.9rem; flex-wrap: wrap; }
.site-nav a { color: var(--leaf); }
main { padding: 0.6rem 0 3rem; }
h1, h2, h3 {
	font-family: "Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif;
	letter-spacing: -0.02em;
}
h1 { font-size: clamp(2rem, 5vw, 2.7rem); margin: 0 0 0.45rem; line-height: 1.15; }
h2 { font-size: 1.35rem; margin: 2.4rem 0 0.7rem; }
p { margin: 0.5rem 0; }
.lede { font-size: 1.15rem; max-width: 34rem; }
.muted { color: var(--muted); }
.eyebrow { margin: 0 0 0.35rem; color: var(--muted); font-size: 0.92rem; letter-spacing: 0.04em; text-transform: uppercase; }
a { color: var(--leaf); }
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
	outline: 3px solid var(--accent);
	outline-offset: 2px;
}
.hero {
	display: grid;
	grid-template-columns: minmax(0, 240px) minmax(0, 1fr);
	gap: 1.4rem 1.8rem;
	align-items: center;
	margin: 1rem 0 1.4rem;
}
@media (max-width: 720px) {
	.hero { grid-template-columns: 1fr; }
}
.hero-copy .row { margin-top: 1rem; }
.card {
	background: var(--card);
	border: 1px solid var(--line);
	border-radius: 1.1rem;
	padding: 1.1rem;
	margin: 1rem 0;
}
.gitty-frame {
	display: block;
	width: min(100%, 240px);
	height: auto;
	margin: 0.4rem 0;
	border-radius: 1.4rem;
	box-shadow: 0 10px 30px rgba(61, 44, 30, 0.08);
	background: #f4efe4;
}
.gitty-frame.large { width: min(100%, 320px); }
.gitty-frame.is-hidden { display: none; }
.notice {
	margin: 0 0 1.2rem;
	padding: 0.7rem 0.9rem;
	border-left: 3px solid var(--line);
	color: var(--muted);
	font-size: 0.95rem;
}
.facts {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
	gap: 0.7rem;
	margin: 1rem 0;
}
.facts div {
	background: var(--card);
	border: 1px solid var(--line);
	border-radius: 0.9rem;
	padding: 0.75rem 0.9rem;
}
.facts dt { margin: 0; color: var(--muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
.facts dd { margin: 0.15rem 0 0; font-weight: 650; }
.links { display: flex; flex-wrap: wrap; gap: 0.4rem 1rem; }
label { display: block; font-size: 0.92rem; margin-bottom: 0.35rem; }
.field { margin: 0.85rem 0; }
.field-error { color: #8a3418; font-size: 0.88rem; min-height: 1.2em; }
input[aria-invalid="true"] { border-color: #b3471d; }
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
button[aria-disabled="true"], .button[aria-disabled="true"] {
	opacity: 0.55;
	pointer-events: none;
}
ol { padding-left: 1.2rem; }
.steps { max-width: 34rem; }
.classes { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.chip {
	border: 1px solid var(--line);
	border-radius: 999px;
	padding: 0.25rem 0.7rem;
	background: #fff;
	font-size: 0.92rem;
}
.chip[data-class="earth"] { border-color: var(--earth); color: #355126; }
.chip[data-class="water"] { border-color: var(--water); color: #1f4450; }
.chip[data-class="air"] { border-color: var(--air); color: #2a4660; }
.chip[data-class="fire"] { border-color: var(--fire); color: #5a2e18; }
.chip[data-class="psy"] { border-color: var(--psy); color: #3b2a52; }
.site-footer {
	padding: 0 0 2.5rem;
	color: var(--muted);
	font-size: 0.92rem;
}
@media (prefers-reduced-motion: reduce) {
	html { scroll-behavior: auto; }
}
`;
