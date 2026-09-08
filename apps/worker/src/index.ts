import { handleRequest } from "./http/router.ts";

export { PetSvg } from "./cache/pet-cache.ts";

export default {
	fetch(request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> | Response {
		return handleRequest(request, ctx);
	},
} satisfies ExportedHandler<Env>;
