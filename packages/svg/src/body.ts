import type { Behavior, GittyClass, GrowthStage } from "@gittygotchi/domain";
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

export function renderBody(
	stage: GrowthStage,
	palette: ClassPalette,
	gittyClass: GittyClass,
): string {
	const leaf = gittyClass === "earth";
	switch (stage) {
		case "egg":
			return renderEgg(palette);
		case "hatchling":
			return renderHatchling(palette, leaf);
		case "baby":
			return renderBaby(palette, leaf);
		case "young":
			return renderYoung(palette, leaf);
		case "adult":
			return renderAdult(palette, leaf);
		case "mature":
			return renderMature(palette, leaf);
		default: {
			const exhaustive: never = stage;
			return exhaustive;
		}
	}
}

function fillStroke(palette: ClassPalette, width: number): string {
	return `fill="${palette.body}" stroke="${palette.ink}" stroke-width="${width}"`;
}

export function renderGroundShadow(
	stage: GrowthStage,
	palette: ClassPalette,
	behavior: Behavior,
): string {
	const { cx, cy, rx, ry } = shadowSize(stage);
	return `<g transform="translate(${cx} ${cy})">
		<g class="gitty-shadow gitty-shadow-${behavior}">
			<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${palette.shadow}" opacity="0.45"/>
		</g>
	</g>`;
}

function shadowSize(stage: GrowthStage): { cx: number; cy: number; rx: number; ry: number } {
	switch (stage) {
		case "egg":
			return { cx: 120, cy: 198, rx: 48, ry: 10 };
		case "hatchling":
			return { cx: 120, cy: 204, rx: 50, ry: 9 };
		case "baby":
			return { cx: 120, cy: 202, rx: 46, ry: 9 };
		case "young":
			return { cx: 120, cy: 206, rx: 50, ry: 10 };
		case "adult":
			return { cx: 120, cy: 208, rx: 56, ry: 11 };
		case "mature":
			return { cx: 120, cy: 210, rx: 58, ry: 12 };
		default: {
			const exhaustive: never = stage;
			return exhaustive;
		}
	}
}

function ear(
	x: number,
	y: number,
	rotate: number,
	scale: number,
	palette: ClassPalette,
	opts: { tuft?: boolean; leaf?: boolean } = {},
): string {
	const tuftMark = opts.tuft
		? `<path d="M0 -34 l4 -10 -8 3 4 7" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.4"/>`
		: "";
	const leafMark = opts.leaf
		? `<path d="M-7 -26 q-11 -16 1 -26 q9 8 7 22z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.8"/>`
		: "";
	return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">
		<g class="gitty-ear">
			<path d="M0 6 C-12 2 -14 -18 -5 -34 Q0 -41 5 -34 C14 -18 12 2 0 6Z" ${fillStroke(palette, 3.2)}/>
			<path d="M0 1 C-5 0 -6 -12 -2 -24 Q0 -27 2 -24 C6 -12 5 0 0 1Z" fill="${palette.accentSoft}"/>
			${leafMark}${tuftMark}
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
	return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${palette.accentSoft}" opacity="0.5"/>`;
}

function filledTail(x: number, y: number, d: string, palette: ClassPalette): string {
	return `<g transform="translate(${x} ${y})">
		<g class="gitty-tail">
			<path d="${d}" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="3"/>
		</g>
	</g>`;
}

export function renderEgg(palette: ClassPalette): string {
	return `<g data-gitty-body="egg">
		<ellipse cx="120" cy="130" rx="54" ry="68" ${fillStroke(palette, 4)}/>
		<ellipse cx="118" cy="86" rx="28" ry="14" fill="#fffdf6" opacity="0.62"/>
		<ellipse class="gitty-detail" cx="96" cy="148" rx="6" ry="4.5" fill="${palette.accent}" opacity="0.4"/>
		<ellipse class="gitty-detail" cx="150" cy="140" rx="4.5" ry="3.5" fill="${palette.accent}" opacity="0.32"/>
	</g>`;
}

export function renderHatchling(palette: ClassPalette, leaf = false): string {
	return `<g data-gitty-body="hatchling">
		${filledTail(158, 168, "M0 2 C10 -2 18 -12 16 -22 C22 -8 14 16 -2 14 C-8 12 -6 6 0 2Z", palette)}
		<path d="M66 172 C70 208 170 208 174 172 C150 192 90 192 66 172Z" ${fillStroke(palette, 4)}/>
		<path d="M66 172 L82 156 96 174 112 150 126 168 142 152 158 170 174 172" fill="${palette.body}" stroke="${palette.ink}" stroke-width="3.5" stroke-linejoin="round"/>
		<ellipse cx="120" cy="122" rx="40" ry="36" ${fillStroke(palette, 4)}/>
		${ear(98, 96, -18, 0.62, palette, { leaf })}
		${ear(142, 96, 18, 0.62, palette, { leaf })}
		${belly(120, 132, 18, 11, palette)}
		${paws(100, 140, 178, 11, 7, palette)}
	</g>`;
}

export function renderBaby(palette: ClassPalette, leaf = false): string {
	return `<g data-gitty-body="baby">
		${filledTail(154, 158, "M0 4 C12 0 22 -10 20 -22 C28 -4 16 22 -4 16 C-10 12 -8 8 0 4Z", palette)}
		${ear(96, 112, -16, 0.72, palette, { leaf })}
		${ear(144, 112, 16, 0.72, palette, { leaf })}
		<circle cx="120" cy="146" r="50" ${fillStroke(palette, 4)}/>
		${belly(120, 160, 22, 14, palette)}
		${paws(102, 138, 192, 11, 7, palette)}
	</g>`;
}

export function renderYoung(palette: ClassPalette, leaf = false): string {
	return `<g data-gitty-body="young">
		${filledTail(162, 150, "M0 6 C16 -10 28 -28 22 -42 C40 -18 34 8 16 22 C6 28 -4 18 0 6Z", palette)}
		${ear(86, 96, -26, 0.92, palette, { leaf })}
		${ear(154, 96, 26, 0.92, palette, { leaf })}
		<ellipse cx="120" cy="164" rx="48" ry="38" ${fillStroke(palette, 4)}/>
		${belly(120, 172, 22, 14, palette)}
		${paws(100, 140, 196, 12, 8, palette)}
		<ellipse cx="120" cy="122" rx="42" ry="36" ${fillStroke(palette, 4)}/>
	</g>`;
}

export function renderAdult(palette: ClassPalette, leaf = false): string {
	return `<g data-gitty-body="adult">
		${filledTail(166, 148, "M0 8 C20 -6 42 0 46 18 C48 34 32 44 18 36 C8 30 12 16 0 14Z", palette)}
		${ear(80, 94, -32, 1.08, palette, { leaf })}
		${ear(160, 94, 32, 1.08, palette, { leaf })}
		<ellipse cx="120" cy="168" rx="58" ry="36" ${fillStroke(palette, 4)}/>
		${belly(120, 174, 28, 16, palette)}
		${paws(96, 144, 198, 14, 8, palette)}
		<ellipse cx="120" cy="120" rx="46" ry="40" ${fillStroke(palette, 4)}/>
	</g>`;
}

export function renderMature(palette: ClassPalette, leaf = false): string {
	return `<g data-gitty-body="mature">
		${filledTail(168, 142, "M0 10 C24 -12 50 -4 54 18 C56 38 36 50 16 40 C4 34 10 18 0 16Z", palette)}
		${ear(76, 88, -34, 1.16, palette, { tuft: true, leaf })}
		${ear(164, 88, 34, 1.16, palette, { tuft: true, leaf })}
		<ellipse cx="120" cy="168" rx="60" ry="38" ${fillStroke(palette, 4)}/>
		${belly(120, 174, 30, 17, palette)}
		${paws(94, 146, 200, 15, 9, palette)}
		<ellipse cx="78" cy="136" rx="11" ry="8" ${fillStroke(palette, 2.5)}/>
		<ellipse cx="162" cy="136" rx="11" ry="8" ${fillStroke(palette, 2.5)}/>
		<ellipse cx="120" cy="116" rx="48" ry="42" ${fillStroke(palette, 4)}/>
	</g>`;
}
