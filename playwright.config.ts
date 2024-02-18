import { defineConfig } from "@playwright/test";

export default defineConfig({
	testIgnore: [
		"dist/**",
		"**/*.js",
		"**/*.test.ts"
	]
});
