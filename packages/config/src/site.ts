export const PRODUCTION_ORIGIN = "https://gittygotchi.alpdogan.co";

export const GITHUB_REPO_URL = "https://github.com/alpdogan/gittygotchi";

export const EXAMPLE_USERNAME = "alpdogan";

export function readmeSnippet(username: string): string {
	return `[![GittyGotchi](${PRODUCTION_ORIGIN}/${username}.svg)](${PRODUCTION_ORIGIN}/${username})`;
}
