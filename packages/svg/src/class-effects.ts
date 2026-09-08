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
	const egg = isEggStage(stage);
	const leaves = egg
		? `<path d="M86 78 q8 -18 4 -28 q12 8 8 26z"/><path d="M150 80 q-6 -16 2 -26 q10 10 4 26z"/>`
		: `<path d="M62 116 q8 -16 2 -26 q12 8 10 24z"/><path d="M168 114 q-4 -14 4 -24 q10 10 2 24z"/>`;
	const moss =
		stage === "hatchling" || stage === "egg"
			? ""
			: `<ellipse class="gitty-detail" cx="100" cy="168" rx="5" ry="3.5" opacity="0.7"/><ellipse class="gitty-detail" cx="142" cy="172" rx="4" ry="3" opacity="0.55"/>`;
	const vine =
		stage === "adult" || stage === "mature"
			? `<path class="gitty-detail" d="M58 150 q-10 16 4 28" fill="none" stroke="${palette.ink}" stroke-width="2"/>`
			: "";
	const pebble =
		stage === "mature"
			? `<ellipse class="gitty-detail" cx="176" cy="176" rx="7" ry="5" fill="${palette.shadow}" stroke="${palette.ink}" stroke-width="2"/>`
			: "";
	return `<g class="gitty-earth" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2">${leaves}${moss}</g>${vine}${pebble}`;
}

function waterTraits(palette: ClassPalette, stage: GrowthStage): string {
	const egg = isEggStage(stage);
	const left = egg ? 78 : 68;
	const right = egg ? 168 : 178;
	const extra =
		stage === "egg" || stage === "hatchling"
			? ""
			: `<circle class="gitty-bubble gitty-detail" cx="120" cy="${egg ? 70 : 86}" r="3.5" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="1.5" opacity="0.7"/>`;
	const wave =
		stage === "adult" || stage === "mature"
			? `<path class="gitty-detail" d="M72 176 q16 -8 32 0 q16 8 32 0 q16 -8 32 0" fill="none" stroke="${palette.accent}" stroke-width="2.5" opacity="0.55"/>`
			: "";
	const droplet =
		stage === "mature"
			? `<path class="gitty-detail" d="M184 92 q8 12 0 18 q-8 -6 0 -18z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.5"/>`
			: "";
	return `
		<circle class="gitty-bubble" cx="${left}" cy="${egg ? 110 : 128}" r="6" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="2" opacity="0.8"/>
		<circle class="gitty-bubble" cx="${right}" cy="${egg ? 96 : 108}" r="4.5" fill="${palette.accentSoft}" stroke="${palette.accent}" stroke-width="2" opacity="0.7"/>
		${extra}${wave}${droplet}`;
}

function airTraits(palette: ClassPalette, stage: GrowthStage): string {
	const egg = isEggStage(stage);
	const sparkX = egg ? 168 : 176;
	const sparkY = egg ? 84 : 76;
	const wisps =
		stage === "egg" || stage === "hatchling"
			? ""
			: `<path class="gitty-detail" d="M52 128 q18 -10 28 4" fill="none" stroke="${palette.accent}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/><path class="gitty-detail" d="M48 142 q20 -6 30 6" fill="none" stroke="${palette.accentSoft}" stroke-width="2" stroke-linecap="round"/>`;
	const tuft =
		stage === "adult" || stage === "mature"
			? `<path class="gitty-spark gitty-detail" d="M64 78 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1"/>`
			: "";
	return `<path class="gitty-spark" d="M${sparkX} ${sparkY} l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.5"/>${wisps}${tuft}`;
}

function fireTraits(palette: ClassPalette, stage: GrowthStage): string {
	const egg = isEggStage(stage);
	const flame = `<path class="gitty-flame" d="M${egg ? 168 : 196} ${egg ? 86 : 108} c8 10 6 22 -2 28 c-10 -8 -8 -18 2 -28z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2"/>`;
	const embers =
		stage === "egg" || stage === "hatchling"
			? ""
			: `<circle class="gitty-flame gitty-detail" cx="70" cy="160" r="3" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1"/><circle class="gitty-flame gitty-detail" cx="58" cy="148" r="2.2" fill="${palette.accent}" opacity="0.8"/>`;
	const crest =
		stage === "mature"
			? `<path class="gitty-flame gitty-detail" d="M120 72 c6 8 4 16 -2 20 c-8 -6 -6 -14 2 -20z" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="1.5"/>`
			: "";
	return `${flame}${embers}${crest}`;
}

function psyTraits(palette: ClassPalette, stage: GrowthStage): string {
	const egg = isEggStage(stage);
	const gemY = egg ? 78 : stage === "hatchling" ? 88 : 108;
	const extras =
		stage === "adult" || stage === "mature"
			? `<g class="gitty-detail" transform="translate(120 130)"><g class="gitty-orbit"><circle cx="42" cy="0" r="2.4" fill="${palette.accent}"/><circle cx="-42" cy="8" r="2" fill="${palette.accentSoft}"/></g></g>`
			: "";
	const third =
		stage === "mature"
			? `<ellipse class="gitty-detail" cx="120" cy="118" rx="4" ry="3" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="1.5"/>`
			: "";
	return `
		<g class="gitty-psy" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="2">
			<path d="M120 ${gemY} l8 10 -8 10 -8 -10z"/>
			<circle cx="${egg ? 72 : 66}" cy="${egg ? 100 : 120}" r="3.5"/>
			<circle cx="${egg ? 176 : 182}" cy="${egg ? 92 : 96}" r="3"/>
			<circle class="gitty-detail" cx="${egg ? 160 : 58}" cy="${egg ? 70 : 84}" r="2.5"/>
		</g>${extras}${third}`;
}
