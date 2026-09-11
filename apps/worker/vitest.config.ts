import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

const workerRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		cloudflareTest(async () => {
			const migrations = await readD1Migrations(path.join(workerRoot, "migrations"));
			return {
				wrangler: { configPath: "./wrangler.jsonc" },
				miniflare: {
					bindings: { TEST_MIGRATIONS: migrations },
				},
			};
		}),
	],
	test: {
		name: "worker",
		include: ["tests/integration/**/*.test.ts"],
		setupFiles: ["./tests/apply-migrations.ts", "./tests/install-github-mock.ts"],
	},
});
