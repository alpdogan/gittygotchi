import type { ClassTreatment } from "../types.ts";

export const AIR_TREATMENT: ClassTreatment = {
	name: "air",
	palette: {
		body: "#f2f2ea",
		accent: "#63b9d6",
		accentSoft: "#b8e4eb",
		outline: "#17283b",
	},
	adultEffects: {
		behind: `
		<g class="air-wind wind-1" data-effect-element="wind" fill="none" stroke="#63b9d6" stroke-width="3" stroke-linecap="round">
			<path d="M28 104 C43 96 56 99 66 106"/>
			<path d="M35 114 C46 110 55 112 60 117"/>
		</g>
		<g class="air-wind wind-2" data-effect-element="wind" fill="none" stroke="#63b9d6" stroke-width="3" stroke-linecap="round">
			<path d="M174 167 C190 158 205 160 216 168"/>
			<path d="M182 178 C193 172 205 174 212 180"/>
		</g>`,
		front: `
		<path class="air-spark spark-1" data-effect-element="spark" d="M190 78 L184 91 L193 89 L188 105 L205 84 L196 86 L201 78Z" fill="#f0b83e" stroke="#17283b" stroke-width="1.8" stroke-linejoin="round"/>
		<path class="air-spark spark-2" data-effect-element="spark" d="M54 160 L49 170 L57 168 L52 181 L66 164 L59 166 L62 160Z" fill="#f0b83e" stroke="#17283b" stroke-width="1.6" stroke-linejoin="round"/>`,
	},
	matureEffects: {
		behind: `
		<g class="air-wind wind-3" data-effect-element="wind" fill="none" stroke="#b8e4eb" stroke-width="3" stroke-linecap="round">
			<path d="M151 52 C170 42 190 45 204 55"/>
			<path d="M161 63 C177 56 192 59 201 66"/>
		</g>`,
		front: `
		<path class="air-spark spark-3" data-effect-element="spark" d="M32 76 L27 86 L35 84 L30 97 L44 80 L37 82 L40 76Z" fill="#f0b83e" stroke="#17283b" stroke-width="1.6" stroke-linejoin="round"/>`,
	},
	earTreatment: `
		<path d="M95 89 C79 87 64 84 57 92 L73 95 L64 101 C75 103 87 97 96 92Z" fill="#63b9d6"/>
		<path d="M143 78 C144 62 148 50 152 45 L154 61 L160 55 C160 68 154 79 149 84Z" fill="#63b9d6"/>`,
	tailTreatment: `
		<path d="M88 171 C62 185 39 168 36 145 C34 126 43 108 58 98" fill="none" stroke="#63b9d6" stroke-width="7" stroke-linecap="round"/>
		<path d="M50 144 C61 138 70 141 78 147 M47 154 C59 150 68 152 73 157" fill="none" stroke="#b8e4eb" stroke-width="3" stroke-linecap="round"/>`,
	bodyMarkings: `
		<path d="M111 158 L129 151 L121 164 L143 158 L131 174 L151 169" fill="none" stroke="#63b9d6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
	foreheadMark: `
		<path d="M129 83 L135 93 L129 101 L124 93Z" fill="#63b9d6"/>
		<path d="M129 87 L130 96" stroke="#b8e4eb" stroke-width="2" stroke-linecap="round"/>`,
	styles: `
		.class-air .gitty-character { animation: air-hover 2.9s ease-in-out infinite; }
		.air-wind {
			animation: air-wind 4.4s ease-in-out infinite;
			transform-box: fill-box;
			transform-origin: center;
		}
		.wind-2 { animation-duration: 5.3s; animation-delay: -2.8s; }
		.wind-3 { animation-duration: 4.9s; animation-delay: -1.9s; }
		.air-spark {
			animation: air-spark 6.2s ease-in-out infinite;
			transform-box: fill-box;
			transform-origin: center;
		}
		.spark-2 { animation-duration: 7.4s; animation-delay: -3.6s; }
		.spark-3 { animation-duration: 8.1s; animation-delay: -5.2s; }
		@keyframes air-wind {
			0%, 12% { opacity: 0; transform: translateX(-16px); }
			28%, 62% { opacity: .9; }
			82%, 100% { opacity: 0; transform: translateX(24px); }
		}
		@keyframes air-spark {
			0%, 67%, 74%, 81%, 100% { opacity: 0; transform: scale(.55) rotate(-8deg); }
			70%, 78% { opacity: 1; transform: scale(1.08) rotate(3deg); }
		}
		@keyframes air-hover {
			0%, 100% { transform: translateY(0) rotate(0); }
			50% { transform: translateY(-2px) rotate(.7deg); }
		}`,
};
