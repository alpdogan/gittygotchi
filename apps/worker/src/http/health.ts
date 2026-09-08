import { jsonResponse } from "./response.ts";

export function healthResponse(): Response {
	return jsonResponse({
		ok: true,
		service: "gittygotchi",
	});
}
