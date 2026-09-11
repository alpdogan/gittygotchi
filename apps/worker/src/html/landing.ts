import { EXAMPLE_USERNAME, readmeSnippet } from "@gittygotchi/config";
import { parseGitHubUsername } from "@gittygotchi/domain";
import { escapeHtml } from "./escape.ts";
import { renderGittyForm } from "./gitty-form.ts";
import { LANDING_WEB_APPLICATION_JSON_LD } from "./json-ld.ts";
import { renderPage } from "./layout.ts";

export function renderLandingPage(rawUsername?: string | null): string {
	const requested = rawUsername === null || rawUsername === undefined ? "" : rawUsername;
	const parsed = requested.length === 0 ? undefined : parseGitHubUsername(requested);
	const formUsername = parsed?.ok ? parsed.username : requested;
	const invalid = parsed !== undefined && !parsed.ok;
	const snippet = readmeSnippet(EXAMPLE_USERNAME);

	return renderPage({
		title: "GittyGotchi · a tiny creature for your GitHub profile",
		description:
			"A tiny creature that lives on your GitHub profile. No login or token. Paste one Markdown snippet into your README; the first visit creates your Gitty as an egg.",
		canonicalPath: "/",
		ogImagePath: `/${EXAMPLE_USERNAME}.svg`,
		jsonLd: LANDING_WEB_APPLICATION_JSON_LD,
		body: `
		<div class="hero">
			<a class="hero-gitty" href="/${EXAMPLE_USERNAME}">
				<img class="gitty-frame" src="/${EXAMPLE_USERNAME}.svg" alt="GittyGotchi for @${EXAMPLE_USERNAME}">
			</a>
			<div class="hero-copy">
				<p class="eyebrow">GittyGotchi</p>
				<h1>A tiny creature that lives on your GitHub profile.</h1>
				<p class="lede">No login. No token. Just add your Gitty.</p>
				<div class="row">
					<a class="button" href="#own">Get your own Gitty</a>
					<a class="button secondary" href="/${EXAMPLE_USERNAME}">See @${EXAMPLE_USERNAME}</a>
				</div>
			</div>
		</div>
		<p class="notice">Everyone starts as an egg. The first visit creates a Gitty; class is assigned then, and growth starts from that moment.</p>

		<section class="card">
			<p>Primary example: <a href="/${EXAMPLE_USERNAME}">@${EXAMPLE_USERNAME}</a></p>
			<pre><code>${escapeHtml(snippet)}</code></pre>
			<p class="muted">Generic usage:</p>
			<pre><code>${escapeHtml(readmeSnippet("YOUR_USERNAME"))}</code></pre>
		</section>

		<h2 id="own">Get your own Gitty</h2>
		<p>Type a GitHub username, preview the Gitty, then copy the Markdown into your profile README.</p>
		${renderGittyForm({
			inputId: "username",
			markdownId: "markdown",
			username: formUsername || EXAMPLE_USERNAME,
			submitLabel: "Open Gitty page",
			invalid,
		})}

		<h2>Install in three steps</h2>
		<ol class="steps">
			<li>Enter your GitHub username.</li>
			<li>Copy the Markdown.</li>
			<li>Paste it into your GitHub profile README.</li>
		</ol>

		<h2>How it works</h2>
		<ul>
			<li>Everyone starts with an egg.</li>
			<li>GitHub history influences class probabilities.</li>
			<li>GitHub activity helps the creature grow.</li>
			<li>Weekends are not punished.</li>
			<li>Gitty never dies.</li>
			<li>Long inactivity becomes hibernation.</li>
		</ul>

		<h2>Classes</h2>
		<div class="classes">
			<span class="chip" data-class="earth">Earth</span>
			<span class="chip" data-class="water">Water</span>
			<span class="chip" data-class="air">Air</span>
			<span class="chip" data-class="fire">Fire</span>
			<span class="chip" data-class="psy">Psy</span>
		</div>
		`,
	});
}
