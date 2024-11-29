import { expect, test } from "vitest";
import { parseIncludeExampleTag } from "./parse-include-example-tag.js";

test("it should parse include example tag", () => {
	const result = parseIncludeExampleTag("path/to/file");
	expect(result).toEqual({ path: "path/to/file" });
});

test("it should parse include example tag with a line selector", () => {
	const result = parseIncludeExampleTag("path/to/file:2-4");
	expect(result).toEqual({ path: "path/to/file", lines: [2, 3, 4] });
});

test("it should parse include example tag with multiple line selectors", () => {
	const result = parseIncludeExampleTag("path/to/file:2-4,15");
	expect(result).toEqual({ path: "path/to/file", lines: [2, 3, 4, 15] });
});

test("it should throw on empty path", () => {
	expect(() => parseIncludeExampleTag("")).toThrowError("Path not found !");
});
