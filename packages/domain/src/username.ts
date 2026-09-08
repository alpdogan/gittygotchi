export const GITHUB_USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/;

export type UsernameValidationSuccess = {
	ok: true;
	username: string;
};

export type UsernameValidationFailure = {
	ok: false;
	reason: "invalid_username";
};

export type UsernameValidationResult = UsernameValidationSuccess | UsernameValidationFailure;

export function parseGitHubUsername(input: string): UsernameValidationResult {
	const username = input.trim().toLowerCase();

	if (!GITHUB_USERNAME_PATTERN.test(username)) {
		return { ok: false, reason: "invalid_username" };
	}

	return { ok: true, username };
}

export function isGitHubUsername(input: string): boolean {
	return parseGitHubUsername(input).ok;
}
