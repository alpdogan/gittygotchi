import type { GittyClass, GrowthStage } from "@gittygotchi/domain";
import { isEggStage } from "./body.ts";
import type { ClassPalette } from "./palette.ts";

export function renderClassEffects(
	gittyClass: GittyClass,
	palette: ClassPalette,
	stage: GrowthStage,
): string {
	switch (gittyClass) {
		case "earth":
			return earthTraits(palette, stage);
		case "water":
			return waterTraits(palette, stage);
		case "air":
			return airTraits(palette, stage);
		case "fire":
			return fireTraits(palette, stage);
		case "psy":
			return psyTraits(palette, stage);
		default: {
			const exhaustive: never = gittyClass;
			return exhaustive;
		}
	}
}

function earthTraits(palette: ClassPalette, stage: GrowthStage): string {
	const moss =
		isEggStage(stage) || stage === "hatchling"
			? ""
			: `<ellipse class="gitty-detail" cx="102" cy="172" rx="8" ry="5" opacity="0.85"/><ellipse class="gitty-detail" cx="140" cy="176" rx="6" ry="4" opacity="0.7"/>`;
	const vine =
		stage === "adult" || stage === "mature"
			? `<path class="gitty-detail" d="M54 148 q-14 18 2 34" fill="none" stroke="${palette.ink}" stroke-width="2.4"/>`
			: "";
	const pebble =
		stage === "mature"
			? `<ellipse class="gitty-detail" cx="184" cy="180" rx="9" ry="6" fill="${palette.shadow}" stroke="${palette.ink}" stroke-width="2"/>`
			: "";
	return `<g class="gitty-earth" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2">${moss}</g>${vine}${pebble}`;
}

function waterTraits(palette: ClassPalette, stage: GrowthStage): string {
	const egg = isEggStage(stage);
	const fin =
		egg || stage === "hatchling"
			? ""
			: `<path class="gitty-detail" d="M58 138 q-22 -6 -26 12 q10 12 26 4z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2"/>`;
	const extra =
		egg || stage === "hatchling"
			? ""
			: `<circle class="gitty-bubble gitty-detail" cx="120" cy="78" r="5" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="2" opacity="0.75"/>`;
	const wave =
		stage === "adult" || stage === "mature"
			? `<path class="gitty-detail" d="M70 184 q18 -10 36 0 q18 10 36 0 q18 -10 36 0" fill="none" stroke="${palette.accent}" stroke-width="3" opacity="0.7"/>`
			: "";
	const droplet =
		stage === "mature"
			? `<path class="gitty-detail" d="M188 88 q10 14 0 22 q-10 -8 0 -22z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.6"/>`
			: "";
	return `
		<circle class="gitty-bubble" cx="${egg ? 74 : 64}" cy="${egg ? 108 : 112}" r="8" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="2" opacity="0.85"/>
		<circle class="gitty-bubble" cx="${egg ? 170 : 186}" cy="${egg ? 92 : 100}" r="5.5" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="2" opacity="0.8"/>
		${fin}${extra}${wave}${droplet}`;
}

function airTraits(palette: ClassPalette, stage: GrowthStage): string {
	const egg = isEggStage(stage);
	const cloud = egg
		? ""
		: `<g class="gitty-detail" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="2" opacity="0.9">
				<ellipse cx="52" cy="132" rx="16" ry="10"/>
				<ellipse cx="64" cy="126" rx="10" ry="8"/>
			</g>`;
	const wisps =
		egg || stage === "hatchling"
			? ""
			: `<path class="gitty-detail" d="M188 128 q16 -12 8 -24" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>`;
	const spark = `<path class="gitty-spark" d="M${egg ? 168 : 178} ${egg ? 78 : 70} l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.6"/>`;
	const tuft =
		stage === "adult" || stage === "mature"
			? `<path class="gitty-spark gitty-detail" d="M66 70 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1.2"/>`
			: "";
	return `${spark}${cloud}${wisps}${tuft}`;
}

function fireTraits(palette: ClassPalette, stage: GrowthStage): string {
	const egg = isEggStage(stage);
	const flame = egg
		? `<path class="gitty-flame" d="M168 78 c10 12 8 26 -2 34 c-12 -10 -10 -22 2 -34z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2"/>`
		: `<path class="gitty-flame" d="M196 118 c14 14 10 32 -4 42 c-16 -12 -12 -28 4 -42z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2.2"/>`;
	const embers =
		egg || stage === "hatchling"
			? ""
			: `<circle class="gitty-flame gitty-detail" cx="66" cy="158" r="4.5" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1.4"/><circle class="gitty-flame gitty-detail" cx="52" cy="144" r="3" fill="${palette.accent}" opacity="0.9"/>`;
	const crest =
		stage === "mature"
			? `<path class="gitty-flame gitty-detail" d="M120 68 c8 10 6 20 -2 26 c-10 -8 -8 -18 2 -26z" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1.6"/>`
			: "";
	return `${flame}${embers}${crest}`;
}

function psyTraits(palette: ClassPalette, stage: GrowthStage): string {
	const egg = isEggStage(stage);
	const gemY = egg ? 74 : stage === "hatchling" ? 90 : stage === "baby" ? 108 : 96;
	const aura =
		stage === "adult" || stage === "mature"
			? `<ellipse class="gitty-psy gitty-detail" cx="120" cy="140" rx="78" ry="62" fill="none" stroke="${palette.accent}" stroke-width="2.4" opacity="0.45"/>`
			: "";
	const extras =
		stage === "adult" || stage === "mature"
			? `<g class="gitty-detail" transform="translate(120 132)"><g class="gitty-orbit"><circle cx="48" cy="0" r="3.2" fill="${palette.accent}"/><circle cx="-46" cy="10" r="2.6" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1"/></g></g>`
			: "";
	const third =
		stage === "mature"
			? `<ellipse class="gitty-detail" cx="120" cy="112" rx="5" ry="3.5" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.5"/>`
			: "";
	return `
		${aura}
		<g class="gitty-psy" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2">
			<path d="M120 ${gemY} l10 12 -10 12 -10 -12z"/>
			<circle cx="${egg ? 70 : 58}" cy="${egg ? 98 : 108}" r="4"/>
			<circle cx="${egg ? 176 : 186}" cy="${egg ? 88 : 92}" r="3.2"/>
			<circle class="gitty-detail" cx="${egg ? 158 : 52}" cy="${egg ? 68 : 78}" r="2.6"/>
		</g>${extras}${third}`;
}
