import type { ClassTreatment } from "../types.ts";

export const PSY_TREATMENT: ClassTreatment = {
	name: "psy",
	palette: {
		body: "#f0e9ef",
		accent: "#7d53c7",
		accentSoft: "#c2a5e5",
		outline: "#24243a",
	},
	adultEffects: {
		behind: `
		<g stroke="#7d53c7" stroke-width="2">
			<path class="psy-particle particle-1" data-effect-element="particle" d="M48 91 L55 99 L48 107 L41 99Z" fill="#c2a5e5"/>
			<circle class="psy-particle particle-2" data-effect-element="particle" cx="195" cy="88" r="6" fill="none"/>
			<path class="psy-particle particle-3" data-effect-element="particle" d="M205 157 L211 163 L205 169 L199 163Z" fill="#7d53c7"/>
			<circle class="psy-particle particle-4" data-effect-element="particle" cx="50" cy="180" r="4" fill="#c2a5e5"/>
		</g>`,
		front: `
		<path class="psy-particle particle-5" data-effect-element="particle" d="M179 48 L185 56 L179 64 L173 56Z" fill="#c2a5e5" stroke="#7d53c7" stroke-width="2"/>
		<path class="psy-particle particle-6" data-effect-element="particle" d="M192 202 L198 208 L192 214 L186 208Z" fill="#7d53c7"/>`,
	},
	matureEffects: {
		behind: `
		<ellipse class="psy-aura" data-effect-element="aura" cx="128" cy="130" rx="82" ry="91" fill="none" stroke="#c2a5e5" stroke-width="3" stroke-dasharray="12 9" opacity=".55"/>
		<path class="psy-particle particle-7" data-effect-element="particle" d="M27 135 L35 143 L27 151 L19 143Z" fill="#c2a5e5" stroke="#7d53c7" stroke-width="2"/>`,
		front: `
		<circle class="psy-particle particle-8" data-effect-element="particle" cx="215" cy="119" r="5" fill="none" stroke="#7d53c7" stroke-width="2"/>
		<path class="psy-particle particle-9" data-effect-element="particle" d="M91 42 L98 49 L91 56 L84 49Z" fill="#7d53c7"/>`,
	},
	earTreatment: `
		<path d="M95 89 C79 87 64 84 57 92 C68 101 82 97 96 92Z" fill="#7d53c7"/>
		<path d="M143 78 C144 62 148 50 152 45 C159 56 155 71 149 84Z" fill="#7d53c7"/>
		<path d="M148 76 C149 66 152 58 154 54" fill="none" stroke="#c2a5e5" stroke-width="3" stroke-linecap="round"/>`,
	tailTreatment: `
		<path d="M88 171 C63 184 41 169 37 148 C33 127 43 105 60 96" fill="none" stroke="#7d53c7" stroke-width="8" stroke-linecap="round"/>
		<path d="M82 166 C65 174 51 164 50 151 C49 140 57 132 67 132" fill="none" stroke="#c2a5e5" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="8 5"/>`,
	bodyMarkings: `
		<path d="M116 157 L128 150 L140 157 L136 170 L121 171Z" fill="#7d53c7" opacity=".78"/>
		<circle cx="128" cy="161" r="4" fill="#c2a5e5"/>`,
	foreheadMark: `
		<path d="M129 80 L139 93 L129 105 L119 93Z" fill="#7d53c7" stroke="#24243a" stroke-width="2"/>
		<path d="M129 85 L133 93 L129 99 L125 93Z" fill="#c2a5e5"/>
		<path d="M101 111 C105 105 112 105 116 110 M133 107 C138 102 145 103 149 108" fill="none" stroke="#7d53c7" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>`,
	styles: `
		.class-psy .gitty-character {
			animation: psy-float 3.6s ease-in-out infinite;
		}
		.class-psy .gitty-shadow {
			animation: psy-shadow 3.6s ease-in-out infinite;
			transform-box: fill-box;
			transform-origin: center;
		}
		.psy-particle {
			animation: psy-particle 5.2s ease-in-out infinite;
			transform-box: fill-box;
			transform-origin: center;
		}
		.particle-2 { animation-duration: 6.4s; animation-delay: -2.7s; }
		.particle-3 { animation-duration: 4.7s; animation-delay: -1.2s; }
		.particle-4 { animation-duration: 7.1s; animation-delay: -4.4s; }
		.particle-5 { animation-duration: 5.8s; animation-delay: -3.1s; }
		.particle-6 { animation-duration: 6.8s; animation-delay: -5.3s; }
		.particle-7 { animation-duration: 5.5s; animation-delay: -2.2s; }
		.particle-8 { animation-duration: 6.1s; animation-delay: -4.7s; }
		.particle-9 { animation-duration: 7.4s; animation-delay: -1.6s; }
		.psy-aura {
			animation: psy-aura 4.2s ease-in-out infinite;
			transform-box: fill-box;
			transform-origin: center;
		}
		@keyframes psy-float {
			0%, 100% { transform: translateY(0); }
			50% { transform: translateY(-5px); }
		}
		@keyframes psy-shadow {
			0%, 100% { opacity: .34; transform: scaleX(1); }
			50% { opacity: .22; transform: scaleX(.82); }
		}
		@keyframes psy-aura {
			0%, 100% { opacity: .42; transform: scale(.98); }
			50% { opacity: .68; transform: scale(1.02); }
		}
		@keyframes psy-particle {
			0%, 100% { opacity: .35; transform: translate(0, 4px) rotate(-8deg); }
			50% { opacity: 1; transform: translate(7px, -9px) rotate(18deg); }
		}`,
};
