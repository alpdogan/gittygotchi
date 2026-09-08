import type { Behavior, Hunger, Mood, VisiblePetState } from "@gittygotchi/domain";
import type { ClassPalette } from "./palette.ts";

export const FACE_KINDS = ["neutral", "happy", "hungry", "sleeping"] as const;

export type FaceKind = (typeof FACE_KINDS)[number];

export function resolveFace(state: VisiblePetState): FaceKind {
	if (isSleepyBehavior(state.behavior)) {
		return "sleeping";
	}
	if (isHungry(state.hunger)) {
		return "hungry";
	}
	if (isHappy(state.mood)) {
		return "happy";
	}
	return "neutral";
}

function isSleepyBehavior(behavior: Behavior): boolean {
	return behavior === "sleeping" || behavior === "sleepy" || behavior === "hibernating";
}

function isHungry(hunger: Hunger): boolean {
	return hunger === "hungry" || hunger === "very_hungry";
}

function isHappy(mood: Mood): boolean {
	return mood === "happy" || mood === "excited";
}

export function renderFace(
	face: FaceKind,
	palette: ClassPalette,
	kind: "egg" | "creature",
): string {
	const y = kind === "egg" ? 128 : 138;
	const left = 104;
	const right = 136;
	const ink = palette.ink;

	if (face === "sleeping") {
		return `
			<path d="M${left - 8} ${y} q8 -6 16 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
			<path d="M${right - 8} ${y} q8 -6 16 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
			<path d="M112 ${y + 22} q8 4 16 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
	}

	if (face === "hungry") {
		return `
			<circle cx="${left}" cy="${y}" r="7" fill="${ink}"/>
			<circle cx="${right}" cy="${y}" r="7" fill="${ink}"/>
			<circle cx="${left + 2}" cy="${y - 2}" r="2" fill="#fff7ea"/>
			<circle cx="${right + 2}" cy="${y - 2}" r="2" fill="#fff7ea"/>
			<ellipse cx="120" cy="${y + 24}" rx="8" ry="9" fill="${ink}"/>
			<path d="M108 ${y - 14} l8 4" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
			<path d="M132 ${y - 14} l-8 4" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
	}

	if (face === "happy") {
		return `
			<path d="M${left - 8} ${y + 2} q8 8 16 0" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>
			<path d="M${right - 8} ${y + 2} q8 8 16 0" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>
			<path d="M110 ${y + 22} q10 12 20 0" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;
	}

	return `
		<circle cx="${left}" cy="${y}" r="7" fill="${ink}"/>
		<circle cx="${right}" cy="${y}" r="7" fill="${ink}"/>
		<circle cx="${left + 2}" cy="${y - 2}" r="2.2" fill="#fff7ea"/>
		<circle cx="${right + 2}" cy="${y - 2}" r="2.2" fill="#fff7ea"/>
		<path d="M110 ${y + 24} q10 8 20 0" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;
}
