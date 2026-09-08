export const HUNGER_STATES = ["full", "normal", "hungry", "very_hungry"] as const;

export type Hunger = (typeof HUNGER_STATES)[number];

export const MOOD_STATES = ["sad", "grumpy", "neutral", "happy", "excited"] as const;

export type Mood = (typeof MOOD_STATES)[number];

export const BEHAVIOR_STATES = [
	"idle",
	"eating",
	"playing",
	"sleepy",
	"sleeping",
	"resting",
	"hibernating",
] as const;

export type Behavior = (typeof BEHAVIOR_STATES)[number];
