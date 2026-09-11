import { EXAMPLE_USERNAME, PRODUCTION_ORIGIN } from "@gittygotchi/config";
import { publicMaxAge } from "../cache/headers.ts";

export function sitemapResponse(): Response {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${PRODUCTION_ORIGIN}/</loc>
	</url>
	<url>
		<loc>${PRODUCTION_ORIGIN}/${EXAMPLE_USERNAME}</loc>
	</url>
</urlset>
`;

	return new Response(body, {
		status: 200,
		headers: {
			"content-type": "application/xml; charset=utf-8",
			"cache-control": publicMaxAge(3600),
		},
	});
}
