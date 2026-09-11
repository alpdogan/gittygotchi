import { PRODUCTION_ORIGIN } from "@gittygotchi/config";
import { publicMaxAge } from "../cache/headers.ts";

export function robotsTxtBody(): string {
	return `User-agent: *
Allow: /
Allow: /*.svg
Disallow: /health
Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml
`;
}

export function robotsResponse(): Response {
	return new Response(robotsTxtBody(), {
		status: 200,
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": publicMaxAge(3600),
		},
	});
}
