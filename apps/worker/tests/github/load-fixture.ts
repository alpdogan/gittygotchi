import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const fixturesDir = join(fileURLToPath(new URL("../../../../fixtures/github/", import.meta.url)));

export function loadGithubFixture(name: string): string {
	return readFileSync(join(fixturesDir, name), "utf8");
}
