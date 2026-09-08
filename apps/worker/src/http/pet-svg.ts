import type { ErrorSvgKind } from "@gittygotchi/svg";
import { FOUNDATION_PREVIEW_STATE, renderErrorSvg, renderGitty } from "@gittygotchi/svg";
import { errorSvgCacheControl } from "../cache/headers.ts";
import { svgResponse } from "./response.ts";

export function petSvgResponse(username: string): Response {
	return svgResponse(
		renderGitty({
			username,
			state: FOUNDATION_PREVIEW_STATE,
			preview: true,
		}),
	);
}

export function errorSvgResponse(kind: ErrorSvgKind, username?: string): Response {
	const status = kind === "invalid_username" ? 400 : kind === "github_user_not_found" ? 404 : 503;
	const svg =
		username === undefined ? renderErrorSvg({ kind }) : renderErrorSvg({ kind, username });
	return svgResponse(svg, status, errorSvgCacheControl(kind));
}
