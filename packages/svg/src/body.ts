import type { GrowthStage } from "@gittygotchi/domain";
import type { ClassPalette } from "./palette.ts";

export function isEggStage(stage: GrowthStage): boolean {
	return stage === "egg";
}

export function bodyScale(stage: GrowthStage): number {
	switch (stage) {
		case "egg":
		case "hatchling":
		case "baby":
		case "young":
		case "adult":
		case "mature":
			return 1;
		default: {
			const exhaustive: never = stage;
			return exhaustive;
		}
	}
}

export function renderBody(stage: GrowthStage, palette: ClassPalette): string {
	switch (stage) {
		case "egg":
			return renderEgg(palette);
		case "hatchling":
			return renderHatchling(palette);
		case "baby":
			return renderBaby(palette);
		case "young":
			return renderYoung(palette);
		case "adult":
			return renderAdult(palette);
		case "mature":
			return renderMature(palette);
		default: {
			const exhaustive: never = stage;
			return exhaustive;
		}
	}
}

function fillStroke(palette: ClassPalette, width: number): string {
	return `fill="${palette.body}" stroke="${palette.ink}" stroke-width="${width}"`;
}

function shadow(cx: number, cy: number, rx: number, ry: number, palette: ClassPalette): string {
	return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${palette.shadow}" opacity="0.45"/>`;
}

function ear(
	x: number,
	y: number,
	rotate: number,
	rx: number,
	ry: number,
	innerRx: number,
	innerRy: number,
	palette: ClassPalette,
	tuft = false,
): string {
	const tuftMark = tuft
		? `<path d="M0 ${-ry + 2} l3 -10 -6 2 3 8" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.5"/>`
		: "";
	return `<g transform="translate(${x} ${y}) rotate(${rotate})">
		<g class="gitty-ear">
			<ellipse cx="0" cy="${-ry + 6}" rx="${rx}" ry="${ry}" ${fillStroke(palette, 3.5)}/>
			<ellipse cx="0" cy="${-ry + 8}" rx="${innerRx}" ry="${innerRy}" fill="${palette.accentSoft}"/>
			${tuftMark}
		</g>
	</g>`;
}

function paws(
	leftX: number,
	rightX: number,
	y: number,
	rx: number,
	ry: number,
	palette: ClassPalette,
): string {
	return `
		<ellipse cx="${leftX}" cy="${y}" rx="${rx}" ry="${ry}" ${fillStroke(palette, 3)}/>
		<ellipse cx="${rightX}" cy="${y}" rx="${rx}" ry="${ry}" ${fillStroke(palette, 3)}/>`;
}

function belly(cx: number, cy: number, rx: number, ry: number, palette: ClassPalette): string {
	return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${palette.accentSoft}" opacity="0.45"/>`;
}

function tail(x: number, y: number, d: string, palette: ClassPalette, width: number): string {
	return `<g transform="translate(${x} ${y})">
		<g class="gitty-tail">
			<path d="${d}" fill="none" stroke="${palette.accent}" stroke-width="${width}" stroke-linecap="round"/>
		</g>
	</g>`;
}

export function renderEgg(palette: ClassPalette): string {
	return `<g data-gitty-body="egg">
		${shadow(120, 196, 46, 10, palette)}
		<ellipse cx="120" cy="132" rx="56" ry="70" ${fillStroke(palette, 4)}/>
		<ellipse cx="120" cy="88" rx="32" ry="16" fill="#fff7ea" opacity="0.55"/>
		<ellipse class="gitty-detail" cx="98" cy="150" rx="5" ry="4" fill="${palette.accent}" opacity="0.35"/>
		<ellipse class="gitty-detail" cx="148" cy="142" rx="4" ry="3.5" fill="${palette.accent}" opacity="0.3"/>
	</g>`;
}

export function renderHatchling(palette: ClassPalette): string {
	return `<g data-gitty-body="hatchling">
		${shadow(120, 202, 48, 9, palette)}
		${tail(168, 168, "M0 0 q18 -8 22 -24", palette, 9)}
		<path d="M68 168 C72 204 168 204 172 168 C148 186 92 186 68 168Z" ${fillStroke(palette, 4)}/>
		<path d="M68 168 L84 156 96 170 112 152 124 166 140 154 156 168 172 168" fill="${palette.body}" stroke="${palette.ink}" stroke-width="3.5" stroke-linejoin="round"/>
		<ellipse cx="120" cy="118" rx="38" ry="36" ${fillStroke(palette, 4)}/>
		${ear(96, 88, -22, 11, 18, 4.5, 8, palette)}
		${ear(144, 88, 22, 11, 18, 4.5, 8, palette)}
		${belly(120, 128, 18, 12, palette)}
		${paws(102, 138, 176, 10, 7, palette)}
	</g>`;
}

export function renderBaby(palette: ClassPalette): string {
	return `<g data-gitty-body="baby">
		${shadow(120, 200, 50, 10, palette)}
		${tail(162, 160, "M0 0 q22 -6 28 -22", palette, 11)}
		${ear(92, 100, -26, 14, 24, 5.5, 11, palette)}
		${ear(148, 100, 26, 14, 24, 5.5, 11, palette)}
		<ellipse cx="120" cy="142" rx="52" ry="48" ${fillStroke(palette, 4)}/>
		${belly(120, 156, 24, 16, palette)}
		${paws(100, 140, 186, 12, 8, palette)}
	</g>`;
}

export function renderYoung(palette: ClassPalette): string {
	return `<g data-gitty-body="young">
		${shadow(120, 202, 54, 11, palette)}
		${tail(166, 154, "M0 0 q28 -14 34 -36", palette, 11)}
		${ear(86, 98, -28, 16, 28, 6.5, 13, palette)}
		${ear(154, 98, 28, 16, 28, 6.5, 13, palette)}
		<ellipse cx="120" cy="140" rx="54" ry="46" ${fillStroke(palette, 4)}/>
		${belly(120, 154, 26, 16, palette)}
		${paws(98, 142, 184, 13, 8, palette)}
	</g>`;
}

export function renderAdult(palette: ClassPalette): string {
	return `<g data-gitty-body="adult">
		${shadow(120, 204, 56, 11, palette)}
		${tail(170, 148, "M0 0 q18 -8 28 -4 q12 8 8 22 q-8 10 -20 4", palette, 12)}
		${ear(84, 100, -30, 17, 30, 7, 14, palette)}
		${ear(156, 100, 30, 17, 30, 7, 14, palette)}
		<ellipse cx="120" cy="142" rx="56" ry="44" ${fillStroke(palette, 4)}/>
		${belly(120, 156, 28, 16, palette)}
		${paws(96, 144, 184, 14, 8, palette)}
	</g>`;
}

export function renderMature(palette: ClassPalette): string {
	return `<g data-gitty-body="mature">
		${shadow(120, 206, 58, 12, palette)}
		${tail(172, 144, "M0 0 q22 -12 36 -6 q16 10 10 28 q-10 14 -26 6 q-8 -4 -8 -12", palette, 13)}
		${ear(82, 98, -32, 18, 32, 7.5, 15, palette, true)}
		${ear(158, 98, 32, 18, 32, 7.5, 15, palette, true)}
		<ellipse cx="120" cy="140" rx="58" ry="46" ${fillStroke(palette, 4)}/>
		${belly(120, 154, 30, 17, palette)}
		<path class="gitty-detail" d="M96 150 q6 6 0 10" fill="none" stroke="${palette.accent}" stroke-width="2" stroke-linecap="round"/>
		<path class="gitty-detail" d="M144 150 q-6 6 0 10" fill="none" stroke="${palette.accent}" stroke-width="2" stroke-linecap="round"/>
		${paws(94, 146, 186, 15, 9, palette)}
	</g>`;
}
