import { EXAMPLE_USERNAME, PRODUCTION_ORIGIN } from "@gittygotchi/config";

export const LANDING_WEB_APPLICATION_JSON_LD = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: "GittyGotchi",
	url: PRODUCTION_ORIGIN,
	description:
		"A tiny creature that lives on your GitHub profile. No login or token. Paste one Markdown snippet into your README; the first visit creates your Gitty as an egg.",
	isAccessibleForFree: true,
	applicationCategory: "EntertainmentApplication",
	inLanguage: "en",
	image: `${PRODUCTION_ORIGIN}/${EXAMPLE_USERNAME}.svg`,
} as const;

export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replaceAll("<", "\\u003c");
	return `<script type="application/ld+json">${json}</script>`;
}
