import { expect, test } from "vitest";
import { parseIncludeExampleTag } from "./parseIncludeExampleTag.js";

test("it should parse include example tag", () => {
	const result = parseIncludeExampleTag("path/to/file");
	expect(result).toEqual({ path: "path/to/file" });
});

test("it should parse include example tag with a line selector", () => {
	const result = parseIncludeExampleTag("path/to/file[2-4]");
	expect(result).toEqual({ path: "path/to/file", lines: [2, 3, 4] });
});

test("it should parse include example tag with multiple line selectors", () => {
	const result = parseIncludeExampleTag("path/to/file[2-4,15]");
	expect(result).toEqual({ path: "path/to/file", lines: [2, 3, 4, 15] });
});

test("it should throw on empty path", () => {
	expect(() => parseIncludeExampleTag("")).toThrowError("Path not found !");
});

test("it should throw migration error for old colon syntax", () => {
	expect(() => parseIncludeExampleTag("path/to/file:2-4")).toThrowError(
		/BREAKING CHANGE: The colon syntax 'path\/to\/file:2-4' is no longer supported/,
	);
});

test("it should throw migration error for old colon syntax with multiple selectors", () => {
	expect(() => parseIncludeExampleTag("path/to/file:2-4,15")).toThrowError(
		/BREAKING CHANGE: The colon syntax 'path\/to\/file:2-4,15' is no longer supported/,
	);
});

test("it should allow colons in file paths without selectors", () => {
	const result = parseIncludeExampleTag("path:with:colons/file.ts");
	expect(result).toEqual({ path: "path:with:colons/file.ts" });
});
