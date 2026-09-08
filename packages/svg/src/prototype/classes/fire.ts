import type { ClassTreatment } from "../types.ts";

export const FIRE_TREATMENT: ClassTreatment = {
	name: "fire",
	palette: {
		body: "#f5e8dc",
		accent: "#ef6437",
		accentSoft: "#f5ad4e",
		outline: "#2b2632",
	},
	adultEffects: {
		behind: `
		<g stroke="#2b2632" stroke-width="2" stroke-linejoin="round">
			<path class="fire-flame flame-1" data-effect-element="flame" d="M43 178 C31 164 41 151 52 142 C49 154 61 158 57 171 C55 180 49 184 43 178Z" fill="#ef6437"/>
			<path class="fire-flame flame-2" data-effect-element="flame" d="M199 169 C187 155 197 141 208 132 C205 145 217 149 213 162 C211 171 205 175 199 169Z" fill="#ef6437"/>
			<path class="fire-flame flame-3" data-effect-element="flame" d="M188 81 C180 70 187 60 196 53 C193 64 203 67 199 77 C197 83 192 86 188 81Z" fill="#f5ad4e"/>
		</g>`,
		front: `
		<g fill="#f5ad4e">
			<circle class="fire-ember ember-1" data-effect-element="ember" cx="55" cy="120" r="3"/>
			<circle class="fire-ember ember-2" data-effect-element="ember" cx="211" cy="111" r="2.5"/>
			<circle class="fire-ember ember-3" data-effect-element="ember" cx="179" cy="203" r="2"/>
			<path class="fire-ember ember-4" data-effect-element="ember" d="M72 61 L76 68 L72 75 L68 68Z"/>
		</g>`,
	},
	matureEffects: {
		behind: `
		<path class="fire-flame flame-4" data-effect-element="flame" d="M27 112 C19 101 27 90 36 83 C32 94 43 98 39 108 C37 115 31 117 27 112Z" fill="#f5ad4e" stroke="#2b2632" stroke-width="2" stroke-linejoin="round"/>`,
		front: `
		<g fill="#f5ad4e">
			<circle class="fire-ember ember-5" data-effect-element="ember" cx="93" cy="48" r="2.5"/>
			<path class="fire-ember ember-6" data-effect-element="ember" d="M215 198 L219 204 L215 210 L211 204Z"/>
		</g>
		<path class="fire-tail-glow" data-effect-element="tail-flicker" d="M53 119 C51 133 62 139 61 151" fill="none" stroke="#ffd57a" stroke-width="3" stroke-linecap="round"/>`,
	},
	earTreatment: `
		<path d="M95 89 C79 87 64 84 57 92 C68 101 82 97 96 92Z" fill="#ef6437"/>
		<path d="M143 78 C144 62 148 50 152 45 C159 56 155 71 149 84Z" fill="#ef6437"/>
		<path d="M148 76 C149 67 152 59 154 55" fill="none" stroke="#f5ad4e" stroke-width="3" stroke-linecap="round"/>`,
	tailTreatment: `
		<path class="fire-tail-flame" d="M89 171 C68 185 45 173 38 154 C32 137 37 117 52 103 C49 119 63 125 61 140 C60 153 69 163 89 171Z" fill="#ef6437" stroke="#2b2632" stroke-width="2.5" stroke-linejoin="round"/>
		<path class="fire-tail-flame" d="M76 166 C61 159 55 148 58 137 C61 145 70 148 73 156 C74 160 75 163 76 166Z" fill="#f5ad4e"/>`,
	bodyMarkings: `
		<path d="M119 158 C126 148 132 151 134 160 C139 154 147 158 146 168 C139 175 127 175 119 168Z" fill="#ef6437"/>
		<path d="M128 160 C132 156 136 160 135 166" fill="none" stroke="#f5ad4e" stroke-width="3" stroke-linecap="round"/>`,
	foreheadMark: `
		<path d="M129 82 C139 91 136 101 128 103 C119 99 121 90 129 82Z" fill="#ef6437"/>
		<path d="M129 89 C133 94 131 98 128 99 C125 97 126 93 129 89Z" fill="#f5ad4e"/>`,
	styles: `
		.class-fire .gitty-tail { animation: fire-tail-idle 2.2s ease-in-out infinite; }
		.fire-flame, .fire-tail-flame {
			animation: fire-flicker 1.35s ease-in-out infinite;
			transform-box: fill-box;
			transform-origin: 50% 100%;
		}
		.flame-2 { animation-duration: 1.08s; animation-delay: -.54s; }
		.flame-3 { animation-duration: 1.62s; animation-delay: -.91s; }
		.flame-4 { animation-duration: 1.48s; animation-delay: -.72s; }
		.fire-tail-flame { animation-duration: 1.8s; animation-delay: -.35s; }
		.fire-tail-glow { animation: fire-flicker 1.12s ease-in-out infinite; }
		.fire-ember {
			animation: fire-ember 3.2s ease-out infinite;
			transform-box: fill-box;
			transform-origin: center;
		}
		.ember-2 { animation-duration: 4.1s; animation-delay: -2.3s; }
		.ember-3 { animation-duration: 2.7s; animation-delay: -1.1s; }
		.ember-4 { animation-duration: 3.8s; animation-delay: -3s; }
		.ember-5 { animation-duration: 3.5s; animation-delay: -2.6s; }
		.ember-6 { animation-duration: 4.3s; animation-delay: -1.8s; }
		@keyframes fire-flicker {
			0%, 100% { opacity: .82; transform: translateY(1px) scale(.94, .9) rotate(-2deg); }
			50% { opacity: 1; transform: translateY(-2px) scale(1.04, 1.12) rotate(2deg); }
		}
		@keyframes fire-ember {
			0% { opacity: 0; transform: translate(0, 8px) scale(.6); }
			25% { opacity: 1; }
			100% { opacity: 0; transform: translate(5px, -20px) scale(.25); }
		}
		@keyframes fire-tail-idle {
			0%, 100% { transform: rotate(-2deg); }
			45% { transform: rotate(4deg); }
			70% { transform: rotate(1deg); }
		}`,
};
