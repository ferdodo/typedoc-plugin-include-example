import { expect, test } from "vitest";
import { checkLegacySyntax } from "./checkLegacySyntax.js";

test("it should parse tag without file path", () => {
	expect(() => checkLegacySyntax("src/greet.example.ts:5-20")).toThrowError(
		"BREAKING CHANGE: The colon syntax 'src/greet.example.ts:5-20' is no longer supported in v3.0.0+. Please migrate to the new bracket syntax: 'src/greet.example.ts[5:20]'. See documentation for the new bracket syntax.",
	);
});
