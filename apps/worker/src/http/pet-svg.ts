import type { ErrorSvgKind } from "@gittygotchi/svg";
import { PREVIEW_EGG_STATE, renderErrorSvg, renderGitty } from "@gittygotchi/svg";
import { errorSvgCacheControl, NO_STORE } from "../cache/headers.ts";
import { resolveLivePetFromEnv } from "../pet/index.ts";
import { svgResponse } from "./response.ts";

export async function petSvgResponse(env: Env, username: string): Promise<Response> {
	try {
		const result = await resolveLivePetFromEnv(env, username);
		if (!result.ok) {
			return placeholderEggSvgResponse(username, errorSvgCacheControl(result.error.kind));
		}

		return svgResponse(
			renderGitty({
				username,
				state: result.view,
			}),
		);
	} catch (error) {
		console.error("pet svg resolve failed", error);
		return placeholderEggSvgResponse(username, NO_STORE);
	}
}

export function errorSvgResponse(kind: ErrorSvgKind, username?: string): Response {
	const status = kind === "invalid_username" ? 400 : kind === "github_user_not_found" ? 404 : 503;
	const svg =
		username === undefined ? renderErrorSvg({ kind }) : renderErrorSvg({ kind, username });
	return svgResponse(svg, status, errorSvgCacheControl(kind));
}

export function placeholderEggSvgResponse(username: string, cacheControl: string): Response {
	return svgResponse(renderGitty({ username, state: PREVIEW_EGG_STATE }), 200, cacheControl);
}

export function isPreviewEggFallback(kind: ErrorSvgKind): boolean {
	return kind === "github_unavailable" || kind === "internal";
}
