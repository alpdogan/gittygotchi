import { GITHUB_REPO_URL } from "./site.ts";

export const GITHUB_USER_AGENT = `GittyGotchi/1.0 (+${GITHUB_REPO_URL})`;

export const GITHUB_API_VERSION = "2022-11-28";

export const GITHUB_API_ORIGIN = "https://api.github.com";

export const GITHUB_WEB_ORIGIN = "https://github.com";

export const GITHUB_USER_TIMEOUT_MS = 8_000;

export const GITHUB_CONTRIBUTIONS_TIMEOUT_MS = 10_000;

export const GITHUB_USER_MAX_BYTES = 64 * 1024;

export const GITHUB_CONTRIBUTIONS_MAX_BYTES = 1_500_000;
