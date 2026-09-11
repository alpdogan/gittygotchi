import { EXAMPLE_USERNAME, PRODUCTION_ORIGIN, readmeSnippet } from "@gittygotchi/config";
import { publicMaxAge } from "../cache/headers.ts";

export function llmsTxtBody(): string {
	return `# GittyGotchi

> A tiny creature that lives on your GitHub profile.

GittyGotchi is a free web app at ${PRODUCTION_ORIGIN}. No login. No token. No OAuth or GitHub PAT. It does not read private repository contents. Only publicly exposed GitHub data is used.

The first visit to a username page or SVG creates that Gitty as an unrevealed egg. Class is assigned at adoption. Growth follows public activity after that first visit.

## Add a Gitty to a GitHub README

Replace YOUR_USERNAME with a real GitHub username:

${readmeSnippet("YOUR_USERNAME")}

Or generate the snippet at ${PRODUCTION_ORIGIN}. Invalid placeholders such as YOUR_USERNAME.svg render the unrevealed egg so GitHub can display the image.

## Links

- Home: ${PRODUCTION_ORIGIN}/
- Example: ${PRODUCTION_ORIGIN}/${EXAMPLE_USERNAME}
- Example image: ${PRODUCTION_ORIGIN}/${EXAMPLE_USERNAME}.svg
`;
}

export function llmsResponse(): Response {
	return new Response(llmsTxtBody(), {
		status: 200,
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": publicMaxAge(3600),
		},
	});
}
