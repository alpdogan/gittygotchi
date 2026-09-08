import { escapeXml } from "./escape.ts";

export type PlaceholderGittyOptions = {
	username: string;
};

export function renderPlaceholderGitty(options: PlaceholderGittyOptions): string {
	const username = escapeXml(options.username);

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img">
	<title>GittyGotchi placeholder for @${username}</title>
	<desc>A temporary egg. The real Gitty renderer is not implemented yet.</desc>
	<rect width="240" height="240" rx="28" fill="#f4efe4"/>
	<ellipse cx="120" cy="132" rx="58" ry="72" fill="#fff7ea" stroke="#3d2c1e" stroke-width="4"/>
	<ellipse cx="120" cy="86" rx="34" ry="18" fill="#efe0c8" opacity="0.7"/>
	<circle cx="102" cy="128" r="8" fill="#3d2c1e"/>
	<circle cx="138" cy="128" r="8" fill="#3d2c1e"/>
	<circle cx="104" cy="126" r="2.4" fill="#fff7ea"/>
	<circle cx="140" cy="126" r="2.4" fill="#fff7ea"/>
	<path d="M108 154 q12 10 24 0" fill="none" stroke="#3d2c1e" stroke-width="3.5" stroke-linecap="round"/>
	<text x="120" y="222" text-anchor="middle" fill="#6b5340" font-family="ui-rounded, system-ui, sans-serif" font-size="13">placeholder egg</text>
</svg>
`;
}
