import { WorkerEntrypoint } from "cloudflare:workers";
import { parseGitHubUsername } from "@gittygotchi/domain";
import { errorSvgResponse, petSvgResponse } from "../http/pet-svg.ts";

export class PetSvg extends WorkerEntrypoint<Env> {
	override fetch(request: Request): Response {
		const username = petSvgUsername(request);
		if (username === undefined) {
			return errorSvgResponse("internal");
		}

		return petSvgResponse(username);
	}
}

export function canonicalPetSvgRequest(username: string): Request {
	return new Request(`https://gittygotchi.internal/${username}.svg`, { method: "GET" });
}

export function dispatchPetSvg(ctx: ExecutionContext, username: string): Promise<Response> {
	return ctx.exports.PetSvg.fetch(canonicalPetSvgRequest(username));
}

export function petSvgUsername(request: Request): string | undefined {
	const pathname = pathnameWithoutTrailingSlash(new URL(request.url).pathname);
	if (!pathname.endsWith(".svg")) {
		return undefined;
	}

	const parsed = parseGitHubUsername(pathname.slice(1, -".svg".length));
	return parsed.ok ? parsed.username : undefined;
}

function pathnameWithoutTrailingSlash(pathname: string): string {
	if (pathname.length > 1 && pathname.endsWith("/")) {
		return pathname.slice(0, -1);
	}
	return pathname;
}
