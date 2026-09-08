import { handleRequest } from "./http/router.ts";

export default {
	fetch(request: Request): Response {
		return handleRequest(request);
	},
} satisfies ExportedHandler<Env>;
