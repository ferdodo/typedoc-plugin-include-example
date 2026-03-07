import { expect, test } from "vitest";
import { checkLegacySyntax } from "./checkLegacySyntax.js";

test("it should throw on legacy colon syntax with line range", () => {
	expect(() => checkLegacySyntax("src/greet.example.ts:5-20")).toThrowError(
		"BREAKING CHANGE: The colon syntax 'src/greet.example.ts:5-20' is no longer supported in v3.0.0+. Please migrate to the new bracket syntax: 'src/greet.example.ts[5:20]'. See documentation for the new bracket syntax.",
	);
});

test("it should throw on legacy colon syntax with single line", () => {
	expect(() => checkLegacySyntax("file.ts:15")).toThrowError("BREAKING CHANGE");
});

test("it should throw on legacy colon syntax with spaces in selector", () => {
	expect(() => checkLegacySyntax("file.ts:5 - 20")).toThrowError(
		"BREAKING CHANGE",
	);
});

test("it should not throw when tag has no colon", () => {
	expect(() => checkLegacySyntax("foo.example.ts")).not.toThrow();
});

test("it should not throw when colon is followed by non-numeric text", () => {
	expect(() => checkLegacySyntax("file.ts:notdigits")).not.toThrow();
});

test("it should not throw when colon is followed by empty string", () => {
	expect(() => checkLegacySyntax("file.ts:")).not.toThrow();
});

test("it should not throw when colon is followed by only whitespace", () => {
	expect(() => checkLegacySyntax("file.ts:  ")).not.toThrow();
});

test("it should throw on legacy syntax where colon is at index 1", () => {
	expect(() => checkLegacySyntax("a:5")).toThrowError("BREAKING CHANGE");
});

test("it should not throw when colon is followed by mixed alphanumeric", () => {
	expect(() => checkLegacySyntax("file.ts:123abc")).not.toThrow();
	expect(() => checkLegacySyntax("file.ts:abc123")).not.toThrow();
});
