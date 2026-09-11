import { handleRequest } from "./http/router.ts";

export { PetSvg } from "./cache/pet-cache.ts";

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> | Response {
		return handleRequest(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
