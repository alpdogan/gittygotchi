import { renderLandingPage } from "../html/landing.ts";
import { htmlResponse } from "./response.ts";

export function landingResponse(): Response {
	return htmlResponse(renderLandingPage());
}
