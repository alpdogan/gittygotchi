import type { ClassTreatment } from "../types.ts";

export const EARTH_TREATMENT: ClassTreatment = {
	name: "earth",
	palette: {
		body: "#f3eddf",
		accent: "#5f8f4a",
		accentSoft: "#c9d9ac",
		outline: "#17283b",
	},
	adultEffects: {
		behind: `
		<g fill="#5f8f4a">
			<path class="earth-leaf leaf-1" data-effect-element="leaf" d="M38 78 C49 74 55 80 51 90 C42 91 36 86 38 78Z"/>
			<path class="earth-leaf leaf-2" data-effect-element="leaf" d="M190 68 C201 64 207 71 202 81 C194 81 188 76 190 68Z"/>
			<path class="earth-leaf leaf-3" data-effect-element="leaf" d="M205 137 C216 134 221 142 215 151 C207 150 202 145 205 137Z"/>
			<path class="earth-leaf leaf-4" data-effect-element="leaf" d="M49 188 C59 183 66 190 61 199 C53 199 47 195 49 188Z"/>
			<path class="earth-leaf leaf-5" data-effect-element="leaf" d="M178 208 C188 203 194 210 190 219 C181 219 176 215 178 208Z"/>
		</g>`,
		front: `
		<path class="earth-leaf leaf-6" data-effect-element="leaf" d="M73 57 C83 52 90 59 85 69 C77 69 71 65 73 57Z" fill="#79a85d"/>`,
	},
	matureEffects: {
		behind: `
		<g fill="#79a85d" stroke="#5f8f4a" stroke-width="1.5">
			<path class="earth-leaf leaf-7" data-effect-element="leaf" d="M24 126 C36 120 43 127 37 138 C28 138 22 134 24 126Z"/>
			<path class="earth-leaf leaf-8" data-effect-element="leaf" d="M211 99 C221 92 229 99 225 110 C216 111 210 107 211 99Z"/>
		</g>`,
		front: `
		<path class="earth-leaf leaf-9" data-effect-element="leaf" d="M101 43 C111 37 119 43 116 53 C108 56 101 52 101 43Z" fill="#c9d9ac" stroke="#5f8f4a" stroke-width="1.5"/>`,
	},
	earTreatment: `
		<path d="M95 89 C79 88 63 84 57 92 C65 100 80 98 96 92Z" fill="#5f8f4a"/>
		<path d="M143 78 C144 63 148 51 151 47 C156 55 154 69 149 82Z" fill="#5f8f4a"/>`,
	tailTreatment: `
		<path d="M88 171 C60 184 38 166 36 142 C34 119 50 96 71 91" fill="none" stroke="#5f8f4a" stroke-width="7" stroke-linecap="round"/>
		<path d="M45 132 C55 128 63 132 65 141 C56 145 48 141 45 132Z" fill="#79a85d"/>`,
	bodyMarkings: `
		<path d="M118 157 C127 151 136 154 137 163 C129 169 120 166 118 157Z" fill="#5f8f4a" opacity=".85"/>
		<path d="M143 179 C151 174 158 179 155 187 C148 188 143 185 143 179Z" fill="#5f8f4a" opacity=".65"/>`,
	foreheadMark: `
		<path d="M122 91 C126 84 134 84 138 91 C133 99 127 99 122 91Z" fill="#5f8f4a"/>`,
	styles: `
		.class-earth .gitty-tail { animation-duration: 5.8s; }
		.earth-leaf {
			animation: earth-leaf-drift 6.4s ease-in-out infinite;
			transform-box: fill-box;
			transform-origin: center;
		}
		.leaf-2 { animation-duration: 7.8s; animation-delay: -2.1s; opacity: .76; }
		.leaf-3 { animation-duration: 5.9s; animation-delay: -4.2s; opacity: .88; }
		.leaf-4 { animation-duration: 8.6s; animation-delay: -1.3s; opacity: .68; }
		.leaf-5 { animation-duration: 7.1s; animation-delay: -5.4s; opacity: .82; }
		.leaf-6 { animation-duration: 9.2s; animation-delay: -3.2s; opacity: .72; }
		.leaf-7 { animation-duration: 7.5s; animation-delay: -1.7s; }
		.leaf-8 { animation-duration: 6.7s; animation-delay: -4.8s; }
		.leaf-9 { animation-duration: 8.2s; animation-delay: -2.6s; }
		@keyframes earth-leaf-drift {
			0%, 100% { transform: translate(0, -4px) rotate(-8deg); }
			50% { transform: translate(8px, 10px) rotate(24deg); }
		}`,
};
