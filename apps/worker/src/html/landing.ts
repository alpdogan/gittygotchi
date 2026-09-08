import { EXAMPLE_USERNAME, GITHUB_REPO_URL, readmeSnippet } from "@gittygotchi/config";
import { escapeHtml } from "./escape.ts";
import { renderPage } from "./layout.ts";

export function renderLandingPage(): string {
	const snippet = readmeSnippet(EXAMPLE_USERNAME);

	return renderPage({
		title: "GittyGotchi",
		description: "A tiny creature that lives on your GitHub profile.",
		body: `
		<p class="muted">GittyGotchi</p>
		<h1>A tiny creature that lives on your GitHub profile.</h1>
		<p class="lede">No login. No token. Just add your Gitty.</p>

		<section class="card">
			<p>Primary example: <a href="/${EXAMPLE_USERNAME}">@${EXAMPLE_USERNAME}</a></p>
			<a href="/${EXAMPLE_USERNAME}">
				<img class="gitty-frame" src="/${EXAMPLE_USERNAME}.svg" alt="GittyGotchi for @${EXAMPLE_USERNAME}">
			</a>
			<p class="muted">This is the foundation Gitty renderer. Live class and growth are not connected yet.</p>
			<pre><code>${escapeHtml(snippet)}</code></pre>
			<p class="muted">Generic usage:</p>
			<pre><code>${escapeHtml(readmeSnippet("YOUR_USERNAME"))}</code></pre>
		</section>

		<h2>Get your own Gitty</h2>
		<form class="card" data-gitty-form action="#" method="get">
			<label for="username">GitHub username</label>
			<input id="username" name="username" data-username-input maxlength="39" spellcheck="false" placeholder="YOUR_USERNAME" value="${EXAMPLE_USERNAME}" autocomplete="username">
			<img class="gitty-frame" data-gitty-preview src="/${EXAMPLE_USERNAME}.svg" alt="GittyGotchi for @${EXAMPLE_USERNAME}">
			<label for="markdown">Generated Markdown</label>
			<textarea id="markdown" data-markdown readonly>${escapeHtml(snippet)}</textarea>
			<div class="row">
				<button type="button" data-copy>Copy Markdown</button>
				<a class="button secondary" href="/${EXAMPLE_USERNAME}">Open example page</a>
			</div>
		</form>

		<h2>Install in three steps</h2>
		<ol>
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
			<span class="chip">Earth</span>
			<span class="chip">Water</span>
			<span class="chip">Air</span>
			<span class="chip">Fire</span>
			<span class="chip">Psy</span>
		</div>
		<p class="muted">Earth, Water, Air, and Fire are equal normal classes. Psy is rare.</p>

		<h2>Open source</h2>
		<p><a href="${GITHUB_REPO_URL}">${escapeHtml(GITHUB_REPO_URL)}</a></p>
		`,
	});
}
