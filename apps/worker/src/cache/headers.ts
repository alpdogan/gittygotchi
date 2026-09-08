import { NOT_FOUND_SVG_CACHE_TTL_SECONDS, SVG_CACHE_TTL_SECONDS } from "@gittygotchi/config";
import type { ErrorSvgKind } from "@gittygotchi/svg";

export const NO_STORE = "no-store";

export function publicMaxAge(seconds: number): string {
	return `public, max-age=${seconds}`;
}

export const SVG_CACHE_CONTROL = publicMaxAge(SVG_CACHE_TTL_SECONDS);

export function errorSvgCacheControl(kind: ErrorSvgKind): string {
	switch (kind) {
		case "invalid_username":
			return SVG_CACHE_CONTROL;
		case "github_user_not_found":
			return publicMaxAge(NOT_FOUND_SVG_CACHE_TTL_SECONDS);
		case "github_unavailable":
		case "internal":
			return NO_STORE;
		default: {
			const exhaustive: never = kind;
			return exhaustive;
		}
	}
}
