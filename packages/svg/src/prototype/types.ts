export const PROTOTYPE_CLASSES = ["earth", "water", "air", "fire", "psy"] as const;

export type PrototypeClass = (typeof PROTOTYPE_CLASSES)[number];

export type PrototypePalette = {
	body: string;
	accent: string;
	accentSoft: string;
	outline: string;
};

export type ClassEffectTier = {
	behind: string;
	front: string;
};

export type ClassTreatment = {
	name: PrototypeClass;
	palette: PrototypePalette;
	adultEffects: ClassEffectTier;
	matureEffects: ClassEffectTier;
	earTreatment: string;
	tailTreatment: string;
	bodyMarkings: string;
	foreheadMark: string;
	styles: string;
};
