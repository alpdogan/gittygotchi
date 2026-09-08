import { EXAMPLE_USERNAME, readmeSnippet } from "@gittygotchi/config";
import { parseGitHubUsername } from "@gittygotchi/domain";
import { escapeHtml } from "./escape.ts";

export type GittyFormOptions = {
	inputId: string;
	markdownId: string;
	username: string;
	submitLabel: string;
	invalid?: boolean;
};

export function renderGittyForm(options: GittyFormOptions): string {
	const parsed = parseGitHubUsername(options.username);
	const username = parsed.ok ? parsed.username : "";
	const safeInput = escapeHtml(options.username);
	const previewUser = username || EXAMPLE_USERNAME;
	const snippetUser = username || "YOUR_USERNAME";
	const snippet = escapeHtml(readmeSnippet(snippetUser));
	const describedBy = options.invalid
		? ` aria-invalid="true" aria-describedby="${options.inputId}-error"`
		: "";
	const error = options.invalid
		? "Use 1–39 letters, numbers, or single hyphens. No leading, trailing, or doubled hyphens."
		: "";
	const previewHidden = username ? "" : " is-hidden";

	return `
		<form class="card" data-gitty-form action="/" method="get">
			<div class="field">
				<label for="${options.inputId}">GitHub username</label>
				<input id="${options.inputId}" name="username" data-username-input maxlength="39" spellcheck="false" placeholder="YOUR_USERNAME" value="${safeInput}" autocomplete="username"${describedBy}>
				<p class="field-error" id="${options.inputId}-error" data-username-error role="status">${error}</p>
			</div>
			<img class="gitty-frame${previewHidden}" data-gitty-preview src="/${previewUser}.svg" alt="GittyGotchi for @${previewUser}">
			<div class="field">
				<label for="${options.markdownId}">Generated Markdown</label>
				<textarea id="${options.markdownId}" data-markdown readonly>${snippet}</textarea>
			</div>
			<div class="row">
				<button type="button" data-copy>Copy Markdown</button>
				<button type="submit">${escapeHtml(options.submitLabel)}</button>
			</div>
		</form>
	`;
}
