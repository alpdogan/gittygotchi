import { EXAMPLE_USERNAME, GITHUB_REPO_URL, readmeSnippet } from "@gittygotchi/config";
import { escapeHtml } from "./escape.ts";
import { renderPage } from "./layout.ts";

export function renderUserPage(username: string): string {
	const snippet = readmeSnippet(username);
	const safe = escapeHtml(username);
	const ownSnippet = readmeSnippet(EXAMPLE_USERNAME);

	return renderPage({
		title: `@${username}'s Gitty · GittyGotchi`,
		description: `A tiny creature that lives on ${username}'s GitHub profile.`,
		body: `
		<p class="muted"><a href="/">GittyGotchi</a></p>
		<h1>@${safe}'s Gitty</h1>
		<img class="gitty-frame large" src="/${safe}.svg" alt="GittyGotchi placeholder for @${safe}">
		<p><strong>Class:</strong> Coming soon</p>
		<p><strong>Current visible state:</strong> Placeholder</p>
		<p><strong>Growth:</strong> Egg</p>
		<p class="muted">This page is shareable. Exact formulas stay private. The SVG is a Phase 1 placeholder.</p>
		<p>
			<a href="https://github.com/${safe}">View @${safe} on GitHub</a>
			·
			<a href="${GITHUB_REPO_URL}">Star GittyGotchi on GitHub</a>
		</p>

		<h2>Want your own Gitty?</h2>
		<form class="card" data-gitty-form action="#" method="get">
			<label for="own-username">GitHub username</label>
			<input id="own-username" name="username" data-username-input maxlength="39" spellcheck="false" placeholder="YOUR_USERNAME" value="${EXAMPLE_USERNAME}" autocomplete="username">
			<img class="gitty-frame" data-gitty-preview src="/${EXAMPLE_USERNAME}.svg" alt="GittyGotchi placeholder for @${EXAMPLE_USERNAME}">
			<label for="own-markdown">Generated Markdown</label>
			<textarea id="own-markdown" data-markdown readonly>${escapeHtml(ownSnippet)}</textarea>
			<div class="row">
				<button type="button" data-copy>Copy Markdown</button>
			</div>
		</form>
		<p class="muted">No login. No token. No GitHub Action. Paste this format into your profile README:</p>
		<pre><code>${escapeHtml(snippet)}</code></pre>
		`,
	});
}

export function renderInvalidUsernamePage(): string {
	return renderPage({
		title: "Gitty is hiding · GittyGotchi",
		description: "That GitHub username is not valid.",
		body: `
		<p class="muted"><a href="/">GittyGotchi</a></p>
		<h1>Gitty is hiding.</h1>
		<p>That GitHub username is not valid.</p>
		<p>Use 1–39 letters, numbers, or single hyphens. No leading, trailing, or doubled hyphens.</p>
		`,
	});
}
