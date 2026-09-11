import { faviconResponse } from "./favicon.ts";
import { healthResponse } from "./health.ts";
import { llmsResponse } from "./llms.ts";
import { robotsResponse } from "./robots.ts";
import { sitemapResponse } from "./sitemap.ts";

const WELL_KNOWN: Record<string, () => Response> = {
	"/health": healthResponse,
	"/robots.txt": robotsResponse,
	"/sitemap.xml": sitemapResponse,
	"/llms.txt": llmsResponse,
	"/llm.txt": llmsResponse,
	"/favicon.ico": faviconResponse,
	"/favicon.svg": faviconResponse,
	"/apple-touch-icon": faviconResponse,
	"/apple-touch-icon.png": faviconResponse,
	"/apple-touch-icon-precomposed.png": faviconResponse,
};

export function wellKnownResponse(pathname: string): Response | undefined {
	const handler = WELL_KNOWN[pathname];
	return handler === undefined ? undefined : handler();
}
