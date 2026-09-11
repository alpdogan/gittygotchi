import { GITHUB_REPO_URL, readmeSnippet } from "@gittygotchi/config";
import { FOUNDATION_PREVIEW_STATE, sharePageFacts } from "@gittygotchi/svg";
import { escapeHtml } from "./escape.ts";
import { renderGittyForm } from "./gitty-form.ts";
import { renderPage } from "./layout.ts";

const previewFacts = sharePageFacts(FOUNDATION_PREVIEW_STATE);

export function renderUserPage(username: string): string {
	const snippet = readmeSnippet(username);
	const safe = escapeHtml(username);
	const facts = previewFacts
		.map(
			(fact) => `
				<div>
					<dt>${escapeHtml(fact.label)}</dt>
					<dd>${escapeHtml(fact.value)}</dd>
				</div>`,
		)
		.join("");

	return renderPage({
		title: `@${username}'s Gitty · GittyGotchi`,
		description: `A tiny creature that lives on ${username}'s GitHub profile.`,
		canonicalPath: `/${username}`,
		ogImagePath: `/${username}.svg`,
		body: `
		<p class="eyebrow">A public Gitty page</p>
		<h1>@${safe}'s Gitty</h1>
		<div class="gitty-status">
			<img class="gitty-frame large" src="/${safe}.svg" alt="GittyGotchi for @${safe}">
			<dl class="facts">${facts}
			</dl>
		</div>
		<p class="notice">This page is shareable. Exact formulas stay private. Live class and growth are not connected yet, so every username currently shows the same unrevealed egg.</p>
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
