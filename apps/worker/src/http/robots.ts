import { textResponse } from "./response.ts";

export function robotsResponse(): Response {
	return textResponse("User-agent: *\nAllow: /\n", "text/plain; charset=utf-8");
}
