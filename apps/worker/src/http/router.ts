import { parseGitHubUsername } from "@gittygotchi/domain";
import { healthResponse } from "./health.ts";
import { landingResponse } from "./landing.ts";
import { errorSvgResponse, placeholderSvgResponse } from "./placeholder-svg.ts";
import { methodNotAllowed, notFound } from "./response.ts";
import { robotsResponse } from "./robots.ts";
import { invalidUsernamePageResponse, userPageResponse } from "./user-page.ts";

const GET_HEAD = "GET, HEAD";

export function handleRequest(request: Request): Response {
	const url = new URL(request.url);
	const pathname = pathnameWithoutTrailingSlash(url.pathname);

	if (request.method !== "GET" && request.method !== "HEAD") {
		return methodNotAllowed(GET_HEAD);
	}

	if (pathname === "/") {
		return landingResponse();
	}

	if (pathname === "/health") {
		return healthResponse();
	}

	if (pathname === "/robots.txt") {
		return robotsResponse();
	}

	if (pathname.slice(1).includes("/")) {
		return notFound();
	}

	if (pathname.endsWith(".svg")) {
		const rawUsername = pathname.slice(1, -".svg".length);
		const parsed = parseGitHubUsername(rawUsername);
		if (!parsed.ok) {
			return errorSvgResponse("invalid_username", rawUsername);
		}
		return placeholderSvgResponse(parsed.username);
	}

	const parsed = parseGitHubUsername(pathname.slice(1));
	if (!parsed.ok) {
		return invalidUsernamePageResponse();
	}

	return userPageResponse(parsed.username);
}

function pathnameWithoutTrailingSlash(pathname: string): string {
	if (pathname.length > 1 && pathname.endsWith("/")) {
		return pathname.slice(0, -1);
	}
	return pathname;
}
