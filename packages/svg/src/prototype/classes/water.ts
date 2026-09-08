import type { ClassTreatment } from "../types.ts";

export const WATER_TREATMENT: ClassTreatment = {
	name: "water",
	palette: {
		body: "#f0f2e9",
		accent: "#3697dc",
		accentSoft: "#8bd8e8",
		outline: "#17283b",
	},
	adultEffects: {
		behind: `
		<g fill="none" stroke="#3697dc" stroke-width="2.5">
			<circle class="water-bubble bubble-1" data-effect-element="bubble" cx="44" cy="184" r="7"/>
			<circle class="water-bubble bubble-2" data-effect-element="bubble" cx="62" cy="151" r="4"/>
			<circle class="water-bubble bubble-3" data-effect-element="bubble" cx="193" cy="191" r="9"/>
			<circle class="water-bubble bubble-4" data-effect-element="bubble" cx="205" cy="148" r="5"/>
			<circle class="water-bubble bubble-5" data-effect-element="bubble" cx="181" cy="94" r="3.5"/>
		</g>`,
		front: `
		<path class="water-drop drop-1" data-effect-element="drop" d="M46 82 C54 92 52 101 46 104 C39 101 38 92 46 82Z" fill="#8bd8e8" stroke="#3697dc" stroke-width="2"/>
		<path class="water-drop drop-2" data-effect-element="drop" d="M207 103 C214 112 212 119 207 122 C201 119 201 111 207 103Z" fill="#8bd8e8" stroke="#3697dc" stroke-width="2"/>`,
	},
	matureEffects: {
		behind: `
		<g fill="none" stroke="#8bd8e8" stroke-width="2.5">
			<circle class="water-bubble bubble-6" data-effect-element="bubble" cx="28" cy="133" r="5"/>
			<circle class="water-bubble bubble-7" data-effect-element="bubble" cx="218" cy="177" r="4"/>
		</g>
		<path class="water-wave" data-effect-element="wave" d="M30 207 C47 197 62 217 79 207" fill="none" stroke="#3697dc" stroke-width="3" stroke-linecap="round"/>`,
		front: `
		<path class="water-drop drop-3" data-effect-element="drop" d="M88 45 C95 54 93 62 88 65 C82 62 82 54 88 45Z" fill="#8bd8e8" stroke="#3697dc" stroke-width="2"/>`,
	},
	earTreatment: `
		<path d="M95 89 C79 87 64 84 57 92 C67 101 81 97 96 92Z" fill="#3697dc"/>
		<path d="M143 78 C144 62 148 50 152 45 C158 56 154 71 149 83Z" fill="#3697dc"/>
		<path d="M145 75 C147 65 150 58 153 54" fill="none" stroke="#8bd8e8" stroke-width="3" stroke-linecap="round"/>`,
	tailTreatment: `
		<path d="M88 171 C63 184 40 169 36 147 C32 126 42 104 59 95" fill="none" stroke="#3697dc" stroke-width="8" stroke-linecap="round"/>
		<path d="M88 166 C69 176 51 166 48 151 C45 138 51 124 63 118" fill="none" stroke="#8bd8e8" stroke-width="4" stroke-linecap="round"/>`,
	bodyMarkings: `
		<path d="M112 158 C123 151 139 151 151 157 C139 164 124 166 112 158Z" fill="#3697dc" opacity=".76"/>
		<path d="M119 171 C130 166 142 167 151 172" fill="none" stroke="#8bd8e8" stroke-width="4" stroke-linecap="round"/>`,
	foreheadMark: `
		<path d="M129 84 L136 93 L129 101 L122 93Z" fill="#3697dc"/>
		<path d="M129 87 L132 93 L129 96Z" fill="#8bd8e8"/>`,
	styles: `
		.class-water .gitty-tail { animation: water-tail-flow 3.3s ease-in-out infinite; }
		.water-bubble {
			animation: water-bubble-rise 4.8s ease-in infinite;
			transform-box: fill-box;
			transform-origin: center;
		}
		.bubble-2 { animation-duration: 5.7s; animation-delay: -2.3s; }
		.bubble-3 { animation-duration: 6.4s; animation-delay: -4.8s; }
		.bubble-4 { animation-duration: 4.2s; animation-delay: -1.4s; }
		.bubble-5 { animation-duration: 5.2s; animation-delay: -3.5s; }
		.bubble-6 { animation-duration: 5.9s; animation-delay: -4.1s; }
		.bubble-7 { animation-duration: 4.5s; animation-delay: -2.8s; }
		.water-drop { animation: water-drop-bob 3.7s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
		.drop-2 { animation-duration: 4.6s; animation-delay: -2.2s; }
		.drop-3 { animation-duration: 4.1s; animation-delay: -1.6s; }
		@keyframes water-bubble-rise {
			0% { opacity: 0; transform: translate(0, 24px) scale(.7); }
			18% { opacity: .85; }
			80% { opacity: .65; }
			100% { opacity: 0; transform: translate(8px, -42px) scale(1.06); }
		}
		@keyframes water-drop-bob {
			0%, 100% { opacity: .45; transform: translateY(3px); }
			50% { opacity: 1; transform: translateY(-5px); }
		}
		@keyframes water-tail-flow {
			0%, 100% { transform: rotate(-1deg) scaleX(1); }
			50% { transform: rotate(3deg) scaleX(1.025); }
		}`,
};
