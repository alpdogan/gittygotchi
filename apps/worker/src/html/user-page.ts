import { GITHUB_REPO_URL, readmeSnippet } from "@gittygotchi/config";
import type { VisiblePetState } from "@gittygotchi/domain";
import { sharePageFacts } from "@gittygotchi/svg";
import { escapeHtml } from "./escape.ts";
import { renderGittyForm } from "./gitty-form.ts";
import { renderPage } from "./layout.ts";

export function renderUserPage(username: string, state: VisiblePetState): string {
	const snippet = readmeSnippet(username);
	const safe = escapeHtml(username);
	const facts = sharePageFacts(state)
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
		<p class="notice">This page is shareable. Exact formulas stay private. Everyone starts as an egg; growth starts after adoption.</p>
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
	return renderGittyHidingPage({
		description: "That GitHub username is not valid.",
		detail:
			"Use 1–39 letters, numbers, or single hyphens. No leading, trailing, or doubled hyphens.",
	});
}

export function renderGitHubUserNotFoundPage(username: string): string {
	return renderGittyHidingPage({
		description: "GitHub user not found.",
		detail: `@${username} is not a public GitHub user.`,
	});
}

export function renderGitHubUnavailablePage(username: string): string {
	return renderGittyHidingPage({
		description: "Try again soon.",
		detail: `GitHub is unavailable, and Gitty for @${username} is not stored yet.`,
	});
}

function renderGittyHidingPage(copy: { description: string; detail: string }): string {
	return renderPage({
		title: "Gitty is hiding · GittyGotchi",
		description: copy.description,
		canonicalPath: "/",
		body: `
		<p class="eyebrow"><a href="/">GittyGotchi</a></p>
		<h1>Gitty is hiding.</h1>
		<p>${escapeHtml(copy.description)}</p>
		<p>${escapeHtml(copy.detail)}</p>
		<p><a class="button" href="/#own">Get your own Gitty</a></p>
		`,
	});
}
