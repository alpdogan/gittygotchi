import { CARD_FILL, CARD_STROKE } from "./card.ts";
import { compactSvg } from "./compact.ts";
import { escapeXml } from "./escape.ts";

export type ErrorSvgKind =
	| "invalid_username"
	| "github_user_not_found"
	| "github_unavailable"
	| "internal";

export type ErrorSvgOptions = {
	kind: ErrorSvgKind;
	username?: string;
};

const ERROR_COPY: Record<ErrorSvgKind, { title: string; message: string }> = {
	invalid_username: {
		title: "Gitty is hiding.",
		message: "That username is not valid.",
	},
	github_user_not_found: {
		title: "Gitty is hiding.",
		message: "GitHub user not found.",
	},
	github_unavailable: {
		title: "Gitty is hiding.",
		message: "Try again soon.",
	},
	internal: {
		title: "Gitty is hiding.",
		message: "Try again soon.",
	},
};

export function renderErrorSvg(options: ErrorSvgOptions): string {
	const copy = ERROR_COPY[options.kind];
	const username = options.username ? escapeXml(options.username) : "unknown";

	return compactSvg(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img">
	<title>${escapeXml(copy.title)}</title>
	<desc>${escapeXml(copy.message)} Placeholder error image for @${username}.</desc>
	<rect width="240" height="240" rx="28" fill="${CARD_FILL}" stroke="${CARD_STROKE}" stroke-width="3"/>
	<ellipse cx="120" cy="118" rx="52" ry="64" fill="#d9cbb6" stroke="#5c4a3a" stroke-width="4"/>
	<circle cx="104" cy="116" r="6" fill="#5c4a3a"/>
	<circle cx="136" cy="116" r="6" fill="#5c4a3a"/>
	<path d="M108 146 q12 -8 24 0" fill="none" stroke="#5c4a3a" stroke-width="3.5" stroke-linecap="round"/>
	<text x="120" y="198" text-anchor="middle" fill="#5c4a3a" font-family="ui-rounded, system-ui, sans-serif" font-size="16">${escapeXml(copy.title)}</text>
	<text x="120" y="218" text-anchor="middle" fill="#7a6552" font-family="ui-rounded, system-ui, sans-serif" font-size="12">${escapeXml(copy.message)}</text>
</svg>
`);
}
