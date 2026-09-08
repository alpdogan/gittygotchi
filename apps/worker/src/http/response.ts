export function jsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store",
		},
	});
}

export function htmlResponse(html: string, status = 200): Response {
	return new Response(html, {
		status,
		headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": "no-store",
		},
	});
}

export function textResponse(body: string, contentType: string, status = 200): Response {
	return new Response(body, {
		status,
		headers: {
			"content-type": contentType,
			"cache-control": "no-store",
		},
	});
}

export function svgResponse(svg: string, status = 200): Response {
	return new Response(svg, {
		status,
		headers: {
			"content-type": "image/svg+xml; charset=utf-8",
			"cache-control": "public, max-age=60",
		},
	});
}

export function methodNotAllowed(allow: string): Response {
	return new Response("Method Not Allowed", {
		status: 405,
		headers: {
			allow,
			"content-type": "text/plain; charset=utf-8",
		},
	});
}

export function notFound(): Response {
	return new Response("Not Found", {
		status: 404,
		headers: {
			"content-type": "text/plain; charset=utf-8",
		},
	});
}
