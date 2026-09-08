import { renderInvalidUsernamePage, renderUserPage } from "../html/user-page.ts";
import { htmlResponse } from "./response.ts";

export function userPageResponse(username: string): Response {
	return htmlResponse(renderUserPage(username));
}

export function invalidUsernamePageResponse(): Response {
	return htmlResponse(renderInvalidUsernamePage(), 400);
}
