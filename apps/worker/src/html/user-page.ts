import { GITHUB_REPO_URL, readmeSnippet } from "@gittygotchi/config";
import { escapeHtml } from "./escape.ts";
import { renderGittyForm } from "./gitty-form.ts";
import { renderPage } from "./layout.ts";

export function renderUserPage(username: string): string {
	const snippet = readmeSnippet(username);
	const safe = escapeHtml(username);

	return renderPage({
		title: `@${username}'s Gitty · GittyGotchi`,
		description: `A tiny creature that lives on ${username}'s GitHub profile.`,
		canonicalPath: `/${username}`,
		ogImagePath: `/${username}.svg`,
		body: `
		<p class="eyebrow">A public Gitty page</p>
		<h1>@${safe}'s Gitty</h1>
		<img class="gitty-frame large" src="/${safe}.svg" alt="GittyGotchi for @${safe}">
		<p class="notice">This page is shareable. Exact formulas stay private. Live class and growth are not connected yet.</p>
		<dl class="facts">
			<div>
				<dt>Class</dt>
				<dd>Coming soon</dd>
			</div>
			<div>
				<dt>Current visible state</dt>
				<dd>Preview egg</dd>
			</div>
			<div>
				<dt>Growth</dt>
				<dd>Egg</dd>
			</div>
		</dl>
		<p class="links">
			<a href="https://github.com/${safe}">View @${safe} on GitHub</a>
			<a href="${GITHUB_REPO_URL}">Star GittyGotchi on GitHub</a>
		</p>

		<h2 id="own">Want your own Gitty?</h2>
		<p>No login. No token. No GitHub Action. Enter a username, copy the Markdown, and paste it into a profile README.</p>
		${renderGittyForm({
			inputId: "own-username",
			markdownId: "own-markdown",
			username: "",
			submitLabel: "Get my Gitty",
		})}
		<p class="muted">Markdown already on this page for @${safe}:</p>
		<pre><code>${escapeHtml(snippet)}</code></pre>
		`,
	});
}

export function renderInvalidUsernamePage(): string {
	return renderPage({
		title: "Gitty is hiding · GittyGotchi",
		description: "That GitHub username is not valid.",
		canonicalPath: "/",
		body: `
		<p class="eyebrow"><a href="/">GittyGotchi</a></p>
		<h1>Gitty is hiding.</h1>
		<p>That GitHub username is not valid.</p>
		<p>Use 1–39 letters, numbers, or single hyphens. No leading, trailing, or doubled hyphens.</p>
		<p><a class="button" href="/#own">Get your own Gitty</a></p>
		`,
	});
}
