import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		name: "config",
		include: ["tests/**/*.test.ts"],
		environment: "node",
	},
});
