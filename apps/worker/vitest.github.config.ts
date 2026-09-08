import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		name: "github",
		include: ["tests/github/**/*.test.ts"],
		environment: "node",
	},
});
