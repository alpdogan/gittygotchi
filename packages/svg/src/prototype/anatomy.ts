import type { GrowthStage } from "@gittygotchi/domain";
import type { ClassTreatment } from "./types.ts";

const TAIL_PATH =
	"M94 178 C62 197 29 179 27 145 C25 112 48 82 76 82 C101 82 116 101 108 121 C102 138 84 148 69 140 C56 134 54 119 62 109 C68 102 79 101 86 107 C77 106 70 112 70 120 C70 128 80 132 88 126 C101 116 96 97 79 94 C59 91 42 112 43 137 C44 159 62 173 84 167 C88 166 92 170 94 178Z";

const BODY_PATH =
	"M118 130 C102 136 94 151 94 173 C94 195 106 207 124 209 C142 211 164 207 171 190 C179 171 168 142 151 132 C141 126 128 126 118 130Z";

const HEAD_PATH =
	"M108 78 C94 80 84 90 82 104 C80 111 83 117 77 123 L86 126 L80 136 C89 136 94 143 105 147 C123 154 149 148 158 132 C165 119 161 97 148 87 C138 79 121 75 108 78Z";

const LEFT_EAR_PATH =
	"M101 86 C82 84 62 77 51 88 C45 95 48 105 56 109 C66 114 83 105 99 96 C105 92 106 87 101 86Z";

const RIGHT_EAR_PATH =
	"M135 81 C136 62 141 44 151 36 C158 43 160 55 157 69 L166 61 C167 75 159 87 147 94 C139 98 134 91 135 81Z";

type DevelopedStage = Exclude<GrowthStage, "egg">;

type WingGeometry = {
	left: string;
	right: string;
	leftAccent: string;
	rightAccent: string;
};

type StageGeometry = {
	tail: string;
	body: string;
	head: string;
	leftEar: string;
	rightEar: string;
	leftPaw: string;
	rightPaw: string;
	faceTransform: string;
	treatmentTransform: string;
	markingOpacity: number;
	tailAsStroke?: boolean;
	wings?: WingGeometry;
};

const STAGE_GEOMETRY: Record<DevelopedStage, StageGeometry> = {
	hatchling: {
		tail: "M106 177 C90 184 78 173 80 159 C82 147 94 142 102 149 C108 154 105 164 98 164 C93 164 91 158 95 155",
		body: "M109 143 C99 151 98 172 105 188 C112 201 139 203 149 190 C158 177 155 153 145 144 C135 136 118 136 109 143Z",
		head: "M101 91 C91 99 89 121 97 136 C105 150 139 151 151 137 C162 124 159 101 148 91 C136 80 113 81 101 91Z",
		leftEar: "M104 96 C87 83 66 80 58 91 C55 101 66 110 82 108 C91 107 99 103 104 96Z",
		rightEar: "M137 88 C138 71 145 56 153 52 C162 63 159 80 149 94Z",
		leftPaw: "M105 184 C98 188 101 197 111 198 C119 198 122 191 116 186Z",
		rightPaw: "M139 185 C133 190 137 198 147 198 C155 197 157 190 150 186Z",
		faceTransform: "translate(128 115) scale(.82) translate(-128 -115)",
		treatmentTransform: "translate(128 126) scale(.72) translate(-128 -126)",
		markingOpacity: 0.42,
	},
	baby: {
		tail: "M102 180 C78 192 59 178 59 157 C59 139 74 128 88 134 C101 140 101 155 92 161 C84 166 76 161 78 153 C79 148 84 146 89 149",
		body: "M108 137 C95 148 94 177 103 195 C112 211 146 212 159 197 C171 181 164 149 151 138 C140 128 119 128 108 137Z",
		head: "M98 77 C84 89 82 115 91 134 C101 154 143 157 158 137 C170 121 166 94 151 80 C138 68 112 67 98 77Z",
		leftEar: "M103 88 C82 75 55 69 46 83 C39 95 53 108 72 106 C84 104 96 97 103 88Z",
		rightEar: "M136 78 C136 55 145 35 155 29 C166 43 164 65 150 86Z",
		leftPaw: "M102 191 C94 196 97 207 108 209 C118 210 124 201 117 195Z",
		rightPaw: "M145 192 C137 198 141 208 152 209 C162 208 166 199 158 194Z",
		faceTransform: "translate(126 112) scale(1.08) translate(-126 -112)",
		treatmentTransform: "translate(126 117) scale(1.05) translate(-126 -117)",
		markingOpacity: 0.58,
	},
	young: {
		tail: "M98 180 C69 196 42 179 42 151 C42 126 61 108 82 112 C101 116 106 136 94 147 C84 156 69 151 68 140 C67 132 75 126 83 130",
		body: "M111 128 C97 141 96 171 102 194 C108 211 145 215 160 199 C176 181 166 143 151 130 C140 121 122 120 111 128Z",
		head: "M103 75 C89 85 85 106 90 123 C96 143 134 153 153 137 C169 123 165 96 150 82 C138 71 116 68 103 75Z",
		leftEar: "M102 86 C82 78 58 70 49 83 C43 94 55 105 72 105 C84 102 95 95 102 86Z",
		rightEar: "M136 79 C136 58 143 39 153 32 C162 45 161 66 149 88Z",
		leftPaw: "M101 192 C94 198 96 210 107 212 C117 213 122 204 116 197Z",
		rightPaw: "M146 195 C139 201 142 211 153 212 C163 211 167 202 159 197Z",
		faceTransform: "translate(128 114) rotate(-2) translate(-128 -114)",
		treatmentTransform: "translate(128 125) scale(.96) translate(-128 -125)",
		markingOpacity: 0.78,
	},
	adult: {
		tail: TAIL_PATH,
		body: BODY_PATH,
		head: HEAD_PATH,
		leftEar: LEFT_EAR_PATH,
		rightEar: RIGHT_EAR_PATH,
		leftPaw: "M101 192 C94 195 94 205 103 208 C111 210 119 207 119 201 C118 195 108 190 101 192Z",
		rightPaw:
			"M143 194 C137 198 139 207 148 209 C157 211 164 207 163 201 C161 195 150 191 143 194Z",
		faceTransform: "",
		treatmentTransform: "",
		markingOpacity: 0.9,
	},
	mature: {
		tail: "M101 183 C69 204 29 188 24 151 C19 114 46 78 79 79 C107 80 123 102 113 125 C104 146 78 152 61 138 C48 128 48 109 61 99 C73 90 91 95 95 108 C99 120 90 132 79 131 C71 130 66 123 69 116 C71 111 77 109 82 112",
		body: "M115 122 C98 132 91 157 95 184 C98 207 113 217 135 217 C157 217 175 207 179 187 C183 164 170 135 153 124 C142 117 126 116 115 122Z",
		head: "M107 70 C91 76 82 91 83 108 L76 120 L88 124 L78 136 L94 137 L89 145 C103 145 110 153 126 154 C148 155 166 143 171 124 C176 106 167 85 151 76 C139 69 120 66 107 70Z",
		leftEar:
			"M103 84 C78 80 49 64 34 76 C23 85 28 101 42 109 C58 117 82 102 103 92 C111 88 111 85 103 84Z",
		rightEar:
			"M135 78 C134 51 142 25 155 13 C168 25 170 47 162 68 L177 51 C181 73 165 94 147 101 C137 105 134 92 135 78Z",
		leftPaw: "M97 196 C87 202 88 214 100 218 C112 221 124 216 124 207 C123 200 107 192 97 196Z",
		rightPaw:
			"M147 197 C138 202 140 215 152 218 C165 221 177 215 175 207 C173 199 157 193 147 197Z",
		faceTransform: "translate(131 111) scale(1.02) translate(-128 -114)",
		treatmentTransform: "translate(128 136) scale(1.13) translate(-128 -136)",
		markingOpacity: 1,
		tailAsStroke: true,
		wings: {
			left: "M109 137 C91 126 70 126 59 137 C72 139 77 145 72 154 C86 153 98 159 107 169 C112 158 114 146 109 137Z",
			right:
				"M153 137 C171 124 193 123 205 134 C192 137 187 144 192 153 C177 152 166 159 158 170 C153 159 150 147 153 137Z",
			leftAccent: "M102 143 C89 137 78 136 69 139 M102 151 C90 148 83 150 78 155",
			rightAccent: "M160 143 C173 136 186 134 196 137 M162 152 C175 148 183 150 188 154",
		},
	},
};

export function renderStageAnatomy(
	stage: DevelopedStage,
	treatment: ClassTreatment,
	face: string,
): string {
	const geometry = STAGE_GEOMETRY[stage];
	const shell = stage === "hatchling" ? renderHatchlingShell(treatment) : "";
	return `
		<g class="stage-${stage}" data-anatomy-stage="${stage}">
			${renderDevelopedAnatomy(stage, geometry, treatment, face)}
			${shell}
		</g>`;
}

function renderDevelopedAnatomy(
	stage: DevelopedStage,
	geometry: StageGeometry,
	treatment: ClassTreatment,
	face: string,
): string {
	const { palette } = treatment;
	const stroke = `stroke="${palette.outline}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;
	const transform = geometry.treatmentTransform
		? ` transform="${geometry.treatmentTransform}"`
		: "";
	const faceTransform = geometry.faceTransform ? ` transform="${geometry.faceTransform}"` : "";
	const tailTreatment = stage === "hatchling" ? "" : treatment.tailTreatment;
	const bodyMarkings = stage === "hatchling" ? "" : treatment.bodyMarkings;
	const foreheadMark =
		stage === "mature"
			? `<g class="mature-forehead-echo" transform="translate(129 93) scale(1.16) translate(-129 -93)" opacity=".3">${treatment.foreheadMark}</g>${treatment.foreheadMark}`
			: treatment.foreheadMark;
	const pawDetails =
		stage === "mature"
			? "M98 211 L102 205 M108 214 L111 208 M151 213 L154 207 M163 214 L166 208"
			: "M103 202 L106 198 M111 204 L113 200 M148 203 L151 199 M156 204 L158 200";
	const tail = geometry.tailAsStroke
		? `<path data-anatomy-part="tail" d="${geometry.tail}" fill="none" stroke="${palette.outline}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="${geometry.tail}" fill="none" stroke="${palette.body}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`
		: `<path data-anatomy-part="tail" d="${geometry.tail}" fill="${palette.body}" ${stroke}/>`;
	const wings = geometry.wings ? renderWings(geometry.wings, palette, true) : "";

	return `
		<g class="gitty-character">
			<g class="gitty-tail">
				${tail}
				<g class="stage-class-markings stage-class-markings-${stage}" opacity="${geometry.markingOpacity}"${transform}>${tailTreatment}</g>
			</g>
			${wings}

			<g class="gitty-body">
				<path data-anatomy-part="body" d="${geometry.body}" fill="${palette.body}" ${stroke}/>
				<path d="M110 174 C116 187 132 192 145 185 C151 181 154 171 151 161 C140 166 125 164 110 158 C106 163 107 169 110 174Z" fill="${palette.accentSoft}" opacity=".72"/>
				<g class="stage-class-markings stage-class-markings-${stage}" opacity="${geometry.markingOpacity}"${transform}>${bodyMarkings}</g>
			</g>

			<g class="gitty-ears">
				<path data-anatomy-part="left-ear" d="${geometry.leftEar}" fill="${palette.body}" ${stroke}/>
				<path data-anatomy-part="right-ear" d="${geometry.rightEar}" fill="${palette.body}" ${stroke}/>
				<g class="stage-class-markings stage-class-markings-${stage}" opacity="${geometry.markingOpacity}"${transform}>${treatment.earTreatment}</g>
			</g>

			<g class="gitty-head">
				<path data-anatomy-part="head" d="${geometry.head}" fill="${palette.body}" ${stroke}/>
				<g class="stage-class-markings stage-class-markings-${stage}" opacity="${geometry.markingOpacity}"${transform}>${foreheadMark}</g>
				<g${faceTransform}>${face}</g>
			</g>

			<g class="gitty-paws">
				<path data-anatomy-part="left-paw" d="${geometry.leftPaw}" fill="${palette.body}" ${stroke}/>
				<path data-anatomy-part="right-paw" d="${geometry.rightPaw}" fill="${palette.body}" ${stroke}/>
				<path d="${pawDetails}" stroke="${palette.outline}" stroke-width="1.8" stroke-linecap="round"/>
			</g>
		</g>`;
}

export function renderUnrevealedEgg(): string {
	const palette = {
		body: "#f3ead7",
		accent: "#c9aa78",
		accentSoft: "#dfcba8",
		outline: "#655b50",
	};
	return `
		<g class="gitty-character stage-egg">
			<path d="M124 61 C91 67 70 101 72 143 C74 184 94 207 125 210 C158 213 180 188 177 146 C174 104 158 58 124 61Z" fill="${palette.body}" stroke="${palette.outline}" stroke-width="4" stroke-linejoin="round"/>
			<path d="M91 176 C106 187 133 189 153 176" fill="none" stroke="${palette.accentSoft}" stroke-width="8" stroke-linecap="round"/>
			<path d="M126 84 L136 97 L126 109 L116 97Z" fill="${palette.accent}" stroke="${palette.outline}" stroke-width="2"/>
			<path d="M102 139 C111 125 136 121 148 137 C157 150 145 166 129 165 C116 164 111 151 120 143 C126 138 136 141 137 148" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/>
			<path d="M82 158 L94 150 L104 161 L116 148 L128 160 L140 149 L152 158 L169 146" fill="none" stroke="${palette.outline}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
		</g>`;
}

function renderHatchlingShell(treatment: ClassTreatment): string {
	const { palette } = treatment;
	return `
		<g class="hatchling-shell">
			<path d="M75 177 L89 166 L102 180 L116 164 L131 179 L147 165 L163 178 L177 168 L174 199 C155 216 96 216 77 198Z" fill="${palette.body}" stroke="${palette.outline}" stroke-width="4" stroke-linejoin="round"/>
			<path d="M88 198 C108 205 145 205 164 196" fill="none" stroke="${palette.accentSoft}" stroke-width="5" stroke-linecap="round"/>
		</g>`;
}

export function renderAdultSilhouette(outline = "#17283b"): string {
	return renderSilhouette(STAGE_GEOMETRY.adult, outline);
}

export function renderMatureSilhouette(outline = "#17283b"): string {
	return renderSilhouette(STAGE_GEOMETRY.mature, outline);
}

function renderWings(
	wings: WingGeometry,
	palette: ClassTreatment["palette"],
	withAccents: boolean,
): string {
	const wingStroke = `stroke="${palette.outline}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`;
	const accents = withAccents
		? `<path data-anatomy-part="left-wing-accent" d="${wings.leftAccent}" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
				<path data-anatomy-part="right-wing-accent" d="${wings.rightAccent}" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>`
		: "";
	return `
		<g class="gitty-wings" data-anatomy-feature="mature-wings">
			<path data-anatomy-part="left-wing" d="${wings.left}" fill="${palette.body}" ${wingStroke}/>
			<path data-anatomy-part="right-wing" d="${wings.right}" fill="${palette.body}" ${wingStroke}/>
			${accents}
		</g>`;
}

function renderSilhouette(geometry: StageGeometry, outline: string): string {
	const tail = geometry.tailAsStroke
		? `<path d="${geometry.tail}" fill="none" stroke="${outline}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>`
		: `<path d="${geometry.tail}"/>`;
	const wings = geometry.wings ? renderSilhouetteWings(geometry.wings, outline) : "";
	return `
		<g fill="${outline}">
			${tail}
			${wings}
			<path d="${geometry.body}"/>
			<path d="${geometry.leftEar}"/>
			<path d="${geometry.rightEar}"/>
			<path d="${geometry.head}"/>
			<path d="${geometry.leftPaw}"/>
			<path d="${geometry.rightPaw}"/>
		</g>`;
}

function renderSilhouetteWings(wings: WingGeometry, outline: string): string {
	const separation =
		'stroke="#fbf7ee" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
	return `
		<g class="gitty-wings" data-anatomy-feature="mature-wings">
			<path data-anatomy-part="left-wing" d="${wings.left}" fill="${outline}" ${separation}/>
			<path data-anatomy-part="right-wing" d="${wings.right}" fill="${outline}" ${separation}/>
			<path d="${wings.leftAccent}" fill="none" stroke="#fbf7ee" stroke-width="2.2" stroke-linecap="round"/>
			<path d="${wings.rightAccent}" fill="none" stroke="#fbf7ee" stroke-width="2.2" stroke-linecap="round"/>
		</g>`;
}
