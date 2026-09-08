export function compactSvg(markup: string): string {
	return markup.replace(/\s+/g, " ").replace(/> </g, "><").trim();
}
