import { renderLandingPage } from "../html/landing.ts";
import { htmlResponse } from "./response.ts";

export function landingResponse(rawUsername?: string | null): Response {
	return htmlResponse(renderLandingPage(rawUsername));
}
