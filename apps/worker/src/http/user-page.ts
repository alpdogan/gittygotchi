import { type ErrorSvgKind, PREVIEW_EGG_STATE } from "@gittygotchi/svg";
import {
	renderGitHubUnavailablePage,
	renderGitHubUserNotFoundPage,
	renderInvalidUsernamePage,
	renderUserPage,
} from "../html/user-page.ts";
import { resolveLivePetFromEnv } from "../pet/index.ts";
import { isPreviewEggFallback } from "./pet-svg.ts";
import { htmlResponse } from "./response.ts";

export async function userPageResponse(env: Env, username: string): Promise<Response> {
	try {
		const result = await resolveLivePetFromEnv(env, username);
		if (!result.ok) {
			if (isPreviewEggFallback(result.error.kind)) {
				return htmlResponse(renderUserPage(username, PREVIEW_EGG_STATE));
			}
			return gittyErrorPageResponse(result.error.kind, username);
		}

		return htmlResponse(renderUserPage(username, result.view));
	} catch (error) {
		console.error("user page resolve failed", error);
		return htmlResponse(renderUserPage(username, PREVIEW_EGG_STATE));
	}
}

export function invalidUsernamePageResponse(): Response {
	return htmlResponse(renderInvalidUsernamePage(), 400);
}

function gittyErrorPageResponse(kind: ErrorSvgKind, username: string): Response {
	switch (kind) {
		case "invalid_username":
			return invalidUsernamePageResponse();
		case "github_user_not_found":
			return htmlResponse(renderGitHubUserNotFoundPage(username), 404);
		case "github_unavailable":
		case "internal":
			return htmlResponse(renderGitHubUnavailablePage(username), 503);
		default: {
			const exhaustive: never = kind;
			return exhaustive;
		}
	}
}
