import type { ErrorSvgKind } from "@gittygotchi/svg";
import { renderErrorSvg, renderPlaceholderGitty } from "@gittygotchi/svg";
import { svgResponse } from "./response.ts";

export function placeholderSvgResponse(username: string): Response {
	return svgResponse(renderPlaceholderGitty({ username }));
}

export function errorSvgResponse(kind: ErrorSvgKind, username?: string): Response {
	const status = kind === "invalid_username" ? 400 : kind === "github_user_not_found" ? 404 : 503;
	const svg =
		username === undefined ? renderErrorSvg({ kind }) : renderErrorSvg({ kind, username });
	return svgResponse(svg, status);
}
