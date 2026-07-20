import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// e2e/ belongs to Playwright (`bun run test:e2e`), not vitest.
		exclude: ["**/node_modules/**", "**/e2e/**", "**/.next/**", "**/dist/**"],
	},
});
