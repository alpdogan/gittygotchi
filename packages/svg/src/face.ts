import type { Behavior, GrowthStage, Hunger, Mood, VisiblePetState } from "@gittygotchi/domain";
import type { ClassPalette } from "./palette.ts";

export const FACE_KINDS = [
	"neutral",
	"happy",
	"excited",
	"hungry",
	"sad",
	"grumpy",
	"sleeping",
] as const;

export type FaceKind = (typeof FACE_KINDS)[number];

export function resolveFace(state: VisiblePetState): FaceKind {
	if (isSleepyBehavior(state.behavior)) {
		return "sleeping";
	}
	if (isHungry(state.hunger)) {
		return "hungry";
	}
	if (state.mood === "sad") {
		return "sad";
	}
	if (state.mood === "grumpy") {
		return "grumpy";
	}
	if (state.mood === "excited") {
		return "excited";
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
	return mood === "happy";
}

export function faceAnchor(stage: GrowthStage): { left: number; right: number; y: number } {
	switch (stage) {
		case "egg":
			return { left: 104, right: 136, y: 126 };
		case "hatchling":
			return { left: 106, right: 134, y: 118 };
		case "baby":
			return { left: 104, right: 136, y: 140 };
		case "young":
			return { left: 104, right: 136, y: 122 };
		case "adult":
			return { left: 102, right: 138, y: 120 };
		case "mature":
			return { left: 102, right: 138, y: 116 };
		default: {
			const exhaustive: never = stage;
			return exhaustive;
		}
	}
}

export function renderFace(face: FaceKind, palette: ClassPalette, stage: GrowthStage): string {
	const { left, right, y } = faceAnchor(stage);
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
			<path d="M${left - 6} ${y - 14} l8 4" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
			<path d="M${right + 6} ${y - 14} l-8 4" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
	}

	if (face === "sad") {
		return `
			<circle cx="${left}" cy="${y}" r="6.5" fill="${ink}"/>
			<circle cx="${right}" cy="${y}" r="6.5" fill="${ink}"/>
			<circle cx="${left + 2}" cy="${y - 1}" r="2" fill="#fff7ea"/>
			<circle cx="${right + 2}" cy="${y - 1}" r="2" fill="#fff7ea"/>
			<path d="M110 ${y + 28} q10 -8 20 0" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>
			<circle class="gitty-detail" cx="${right + 10}" cy="${y + 8}" r="2.2" fill="${palette.accent}" opacity="0.8"/>`;
	}

	if (face === "grumpy") {
		return `
			<path d="M${left - 8} ${y - 8} l16 4" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
			<path d="M${right + 8} ${y - 8} l-16 4" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
			<circle cx="${left}" cy="${y + 2}" r="6" fill="${ink}"/>
			<circle cx="${right}" cy="${y + 2}" r="6" fill="${ink}"/>
			<path d="M108 ${y + 26} h24" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;
	}

	if (face === "excited") {
		return `
			<circle cx="${left}" cy="${y}" r="8" fill="${ink}"/>
			<circle cx="${right}" cy="${y}" r="8" fill="${ink}"/>
			<circle cx="${left + 2}" cy="${y - 2}" r="2.4" fill="#fff7ea"/>
			<circle cx="${right + 2}" cy="${y - 2}" r="2.4" fill="#fff7ea"/>
			<ellipse cx="120" cy="${y + 24}" rx="9" ry="7" fill="${ink}"/>
			<ellipse cx="120" cy="${y + 22}" rx="5" ry="3" fill="#fff7ea"/>
			<circle class="gitty-detail" cx="${left - 12}" cy="${y - 10}" r="2" fill="${palette.accent}"/>
			<circle class="gitty-detail" cx="${right + 12}" cy="${y - 10}" r="2" fill="${palette.accent}"/>`;
	}

	if (face === "happy") {
		return `
			<circle cx="${left}" cy="${y}" r="7" fill="${ink}"/>
			<circle cx="${right}" cy="${y}" r="7" fill="${ink}"/>
			<circle cx="${left + 2}" cy="${y - 2.2}" r="2.3" fill="#fff7ea"/>
			<circle cx="${right + 2}" cy="${y - 2.2}" r="2.3" fill="#fff7ea"/>
			<ellipse cx="${left - 10}" cy="${y + 10}" rx="6" ry="3.5" fill="${palette.accent}" opacity="0.35"/>
			<ellipse cx="${right + 10}" cy="${y + 10}" rx="6" ry="3.5" fill="${palette.accent}" opacity="0.35"/>
			<path d="M108 ${y + 20} q12 14 24 0" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;
	}

	return `
		<circle cx="${left}" cy="${y}" r="7" fill="${ink}"/>
		<circle cx="${right}" cy="${y}" r="7" fill="${ink}"/>
		<circle cx="${left + 2}" cy="${y - 2}" r="2.2" fill="#fff7ea"/>
		<circle cx="${right + 2}" cy="${y - 2}" r="2.2" fill="#fff7ea"/>
		<ellipse cx="${left - 9}" cy="${y + 10}" rx="5" ry="3" fill="${palette.accent}" opacity="0.22"/>
		<ellipse cx="${right + 9}" cy="${y + 10}" rx="5" ry="3" fill="${palette.accent}" opacity="0.22"/>
		<path d="M110 ${y + 24} q10 8 20 0" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;
}
