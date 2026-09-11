import type { ErrorSvgKind } from "@gittygotchi/svg";
import { renderErrorSvg, renderGitty } from "@gittygotchi/svg";
import { errorSvgCacheControl } from "../cache/headers.ts";
import { resolveLivePetFromEnv } from "../pet/index.ts";
import { svgResponse } from "./response.ts";

export async function petSvgResponse(env: Env, username: string): Promise<Response> {
	const result = await resolveLivePetFromEnv(env, username);
	if (!result.ok) {
		return errorSvgResponse(result.error.kind, username);
	}

	return svgResponse(
		renderGitty({
			username,
			state: result.view,
		}),
	);
}

export function errorSvgResponse(kind: ErrorSvgKind, username?: string): Response {
	const status = kind === "invalid_username" ? 400 : kind === "github_user_not_found" ? 404 : 503;
	const svg =
		username === undefined ? renderErrorSvg({ kind }) : renderErrorSvg({ kind, username });
	return svgResponse(svg, status, errorSvgCacheControl(kind));
}
