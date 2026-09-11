import { publicMaxAge } from "../cache/headers.ts";
import { FAVICON_SVG } from "../html/favicon-svg.ts";

const FAVICON_CACHE_CONTROL = publicMaxAge(86_400);

export function faviconResponse(): Response {
	return new Response(FAVICON_SVG, {
		status: 200,
		headers: {
			"content-type": "image/svg+xml; charset=utf-8",
			"cache-control": FAVICON_CACHE_CONTROL,
		},
	});
}
