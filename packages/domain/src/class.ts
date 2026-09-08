export const GITTY_CLASSES = ["earth", "water", "air", "fire", "psy"] as const;

export type GittyClass = (typeof GITTY_CLASSES)[number];

export const NORMAL_GITTY_CLASSES = ["earth", "water", "air", "fire"] as const;

export type NormalGittyClass = (typeof NORMAL_GITTY_CLASSES)[number];

export const RARE_GITTY_CLASS = "psy" as const;

export type RareGittyClass = typeof RARE_GITTY_CLASS;

export function isGittyClass(value: string): value is GittyClass {
	return (GITTY_CLASSES as readonly string[]).includes(value);
}

export function isNormalGittyClass(value: string): value is NormalGittyClass {
	return (NORMAL_GITTY_CLASSES as readonly string[]).includes(value);
}
