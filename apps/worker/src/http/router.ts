import { parseGitHubUsername } from "@gittygotchi/domain";
import { dispatchPetSvg } from "../cache/pet-cache.ts";
import { healthResponse } from "./health.ts";
import { landingResponse } from "./landing.ts";
import { errorSvgResponse } from "./pet-svg.ts";
import { methodNotAllowed, notFound } from "./response.ts";
import { robotsResponse } from "./robots.ts";
import { invalidUsernamePageResponse, userPageResponse } from "./user-page.ts";

const GET_HEAD = "GET, HEAD";

export function handleRequest(
	request: Request,
	env: Env,
	ctx: ExecutionContext,
): Promise<Response> | Response {
	const url = new URL(request.url);
	const pathname = pathnameWithoutTrailingSlash(url.pathname);

	if (request.method !== "GET" && request.method !== "HEAD") {
		return methodNotAllowed(GET_HEAD);
	}

	if (pathname === "/") {
		return landingResponse(url.searchParams.get("username"));
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
		return dispatchPetSvg(ctx, parsed.username);
	}

	const parsed = parseGitHubUsername(pathname.slice(1));
	if (!parsed.ok) {
		return invalidUsernamePageResponse();
	}

	return userPageResponse(env, parsed.username);
}

function pathnameWithoutTrailingSlash(pathname: string): string {
	if (pathname.length > 1 && pathname.endsWith("/")) {
		return pathname.slice(0, -1);
	}
	return pathname;
}
