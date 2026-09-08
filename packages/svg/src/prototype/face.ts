import type { Behavior, Hunger, Mood } from "@gittygotchi/domain";
import type { PrototypePalette } from "./types.ts";

export type PrototypeExpression =
	| "neutral"
	| "happy"
	| "excited"
	| "hungry"
	| "sad"
	| "grumpy"
	| "sleepy"
	| "sleeping";

export function resolvePrototypeExpression(
	mood: Mood,
	hunger: Hunger,
	behavior: Behavior,
): PrototypeExpression {
	if (behavior === "sleeping" || behavior === "hibernating") {
		return "sleeping";
	}
	if (behavior === "sleepy") {
		return "sleepy";
	}
	if (hunger === "hungry" || hunger === "very_hungry") {
		return "hungry";
	}
	return mood;
}

export function renderPrototypeFace(
	expression: PrototypeExpression,
	palette: PrototypePalette,
): string {
	const eyes = renderEyes(expression, palette);
	const mouth = renderMouth(expression, palette);
	return `<g class="gitty-face face-${expression}">${eyes}${mouth}</g>`;
}

function renderEyes(expression: PrototypeExpression, palette: PrototypePalette): string {
	const ink = palette.outline;
	if (expression === "sleeping") {
		return `
			<path d="M100 112 C105 117 112 117 117 111 M133 109 C138 114 145 114 150 108" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
	}
	if (expression === "sleepy") {
		return `
			<path d="M100 111 C106 114 112 114 117 110 M133 108 C139 111 145 111 150 107" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
	}
	if (expression === "happy") {
		return `
			<g class="gitty-eyes">
				<ellipse cx="108" cy="112" rx="7" ry="10" fill="${ink}"/>
				<ellipse cx="140" cy="109" rx="6.5" ry="9.5" fill="${ink}"/>
				<ellipse cx="105.5" cy="108.5" rx="2.2" ry="3" fill="#fffdf8"/>
				<ellipse cx="137.8" cy="105.8" rx="2" ry="2.8" fill="#fffdf8"/>
			</g>`;
	}
	if (expression === "excited") {
		return `
			<g class="gitty-eyes">
				<ellipse cx="108" cy="111" rx="8" ry="11" fill="${ink}"/>
				<ellipse cx="140" cy="108" rx="7.5" ry="10.5" fill="${ink}"/>
				<circle cx="105" cy="107" r="3" fill="#fffdf8"/>
				<circle cx="137" cy="104" r="2.8" fill="#fffdf8"/>
			</g>`;
	}
	if (expression === "grumpy") {
		return `
			<path d="M98 101 L116 106 M151 99 L133 104" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>
			<g class="gitty-eyes">
				<ellipse cx="108" cy="112" rx="6" ry="7" fill="${ink}"/>
				<ellipse cx="140" cy="109" rx="5.5" ry="6.5" fill="${ink}"/>
				<circle cx="106" cy="110" r="1.8" fill="#fffdf8"/>
				<circle cx="138" cy="107" r="1.6" fill="#fffdf8"/>
			</g>`;
	}
	if (expression === "sad") {
		return `
			<path d="M100 104 C106 100 112 101 116 105 M134 102 C140 98 146 99 150 103" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>
			<g class="gitty-eyes">
				<ellipse cx="108" cy="113" rx="6.5" ry="9" fill="${ink}"/>
				<ellipse cx="140" cy="110" rx="6" ry="8.5" fill="${ink}"/>
				<circle cx="106" cy="110" r="2" fill="#fffdf8"/>
				<circle cx="138" cy="107" r="1.8" fill="#fffdf8"/>
			</g>`;
	}

	const hungryShift = expression === "hungry" ? 2 : 0;
	return `
		<g class="gitty-eyes">
			<ellipse cx="${108 + hungryShift}" cy="112" rx="6.5" ry="9.5" fill="${ink}"/>
			<ellipse cx="${140 + hungryShift}" cy="109" rx="6" ry="9" fill="${ink}"/>
			<circle cx="${106 + hungryShift}" cy="109" r="2" fill="#fffdf8"/>
			<circle cx="${138 + hungryShift}" cy="106" r="1.8" fill="#fffdf8"/>
		</g>`;
}

function renderMouth(expression: PrototypeExpression, palette: PrototypePalette): string {
	const ink = palette.outline;
	const stroke = `fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"`;
	switch (expression) {
		case "happy":
			return `<path d="M118 129 C125 136 135 135 141 127" ${stroke}/><path d="M124 124 C127 126 130 126 133 123" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`;
		case "excited":
			return `<path d="M118 127 C124 140 137 140 143 126 C136 131 126 132 118 127Z" fill="${ink}"/><path d="M125 134 C130 137 136 135 138 131" fill="none" stroke="#fffdf8" stroke-width="2" stroke-linecap="round"/>`;
		case "hungry":
			return `<ellipse cx="131" cy="131" rx="7" ry="8.5" fill="${ink}"/><ellipse cx="131" cy="135" rx="3.5" ry="2" fill="${palette.accent}"/>`;
		case "sad":
			return `<path d="M119 136 C126 128 136 128 142 135" ${stroke}/>`;
		case "grumpy":
			return `<path d="M119 133 L141 130" ${stroke}/>`;
		case "sleepy":
			return `<path d="M122 132 C128 135 135 134 139 130" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
		case "sleeping":
			return `<path d="M123 132 C129 135 135 134 139 130" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`;
		case "neutral":
			return `<path d="M120 130 C127 133 135 132 140 127" ${stroke}/>`;
		default: {
			const exhaustive: never = expression;
			return exhaustive;
		}
	}
}
