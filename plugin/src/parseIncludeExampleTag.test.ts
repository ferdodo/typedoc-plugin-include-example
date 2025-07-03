import { expect, test } from "vitest";
import { parseIncludeExampleTag } from "./parseIncludeExampleTag.js";

test("it should parse include example tag", () => {
	const result = parseIncludeExampleTag("path/to/file");
	expect(result).toEqual({ path: "path/to/file" });
});

test("it should throw error for old dash syntax in brackets", () => {
	expect(() => parseIncludeExampleTag("path/to/file[2-4]")).toThrowError(
		/BREAKING CHANGE: The dash syntax '2-4' inside brackets is no longer supported in v3\.0\.0\+/,
	);
});

test("it should throw error for old dash syntax with multiple selectors", () => {
	expect(() => parseIncludeExampleTag("path/to/file[2-4,15]")).toThrowError(
		/BREAKING CHANGE: The dash syntax '2-4,15' inside brackets is no longer supported in v3\.0\.0\+/,
	);
});

test("it should throw on empty path", () => {
	expect(() => parseIncludeExampleTag("")).toThrowError("Path not found !");
});

test("it should throw migration error for old colon syntax", () => {
	expect(() => parseIncludeExampleTag("path/to/file:2-4")).toThrowError(
		/BREAKING CHANGE: The colon syntax 'path\/to\/file:2-4' is no longer supported in v3\.0\.0\+/,
	);
});

test("it should throw migration error for old colon syntax with multiple selectors", () => {
	expect(() => parseIncludeExampleTag("path/to/file:2-4,15")).toThrowError(
		/BREAKING CHANGE: The colon syntax 'path\/to\/file:2-4,15' is no longer supported in v3\.0\.0\+/,
	);
});

test("it should allow colons in file paths without selectors", () => {
	const result = parseIncludeExampleTag("path:with:colons/file.ts");
	expect(result).toEqual({ path: "path:with:colons/file.ts" });
});

// ============= BRACKET SYNTAX TESTS =============

test("it should handle empty brackets (select all lines)", () => {
	const result = parseIncludeExampleTag("path/to/file[]");
	expect(result).toEqual({ path: "path/to/file[]" });
});

test("it should handle colon-only brackets (select all lines)", () => {
	const result = parseIncludeExampleTag("path/to/file[:]");
	expect(result).toEqual({
		path: "path/to/file",
		parsedSelector: {
			selections: [],
			hasNegativeIndexing: false,
			hasExclusions: false,
		},
	});
});

test("it should parse bracket syntax with colon ranges", () => {
	const result = parseIncludeExampleTag("path/to/file[2:8]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector).toBeDefined();
	expect(result.parsedSelector?.selections).toHaveLength(1);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		start: 2,
		end: 8,
		isNegative: false,
	});
});

test("it should parse single line selection", () => {
	const result = parseIncludeExampleTag("path/to/file[10]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		single: 10,
		isNegative: false,
	});
});

test("it should parse negative indexing in brackets", () => {
	const result = parseIncludeExampleTag("path/to/file[-5:]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.hasNegativeIndexing).toBe(true);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		start: 5,
		end: undefined,
		isNegative: true,
	});
});

test("it should parse exclusions in brackets", () => {
	const result = parseIncludeExampleTag("path/to/file[1:10,!5:7]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.hasExclusions).toBe(true);
	expect(result.parsedSelector?.selections).toHaveLength(2);
	expect(result.parsedSelector?.selections[1].type).toBe("exclusion");
});

test("it should handle file paths with brackets in the path itself", () => {
	const result = parseIncludeExampleTag("path/with[brackets]/file.ts");
	expect(result).toEqual({ path: "path/with[brackets]/file.ts" });
});

test("it should handle Windows-style paths with brackets", () => {
	const result = parseIncludeExampleTag("C:\\path\\to\\file.ts[10]");
	expect(result.path).toBe("C:\\path\\to\\file.ts");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		single: 10,
		isNegative: false,
	});
});

test("it should handle URLs with brackets", () => {
	const result = parseIncludeExampleTag("https://example.com/file.ts[1:5]");
	expect(result.path).toBe("https://example.com/file.ts");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		start: 1,
		end: 5,
		isNegative: false,
	});
});

test("it should handle paths with spaces and brackets", () => {
	const result = parseIncludeExampleTag("path with spaces/file.ts[2:4]");
	expect(result.path).toBe("path with spaces/file.ts");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		start: 2,
		end: 4,
		isNegative: false,
	});
});

test("it should detect old syntax even with complex selectors", () => {
	expect(() => parseIncludeExampleTag("path/to/file:1,3,5-7,10")).toThrowError(
		/BREAKING CHANGE: The colon syntax 'path\/to\/file:1,3,5-7,10' is no longer supported in v3\.0\.0\+/,
	);
});

test("it should not confuse colons in paths with old syntax", () => {
	const result = parseIncludeExampleTag("http://example.com:8080/file.ts");
	expect(result).toEqual({ path: "http://example.com:8080/file.ts" });
});

test("it should handle relative paths with brackets", () => {
	const result = parseIncludeExampleTag("../parent/file.ts[5:]");
	expect(result.path).toBe("../parent/file.ts");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		start: 5,
		end: undefined,
		isNegative: false,
	});
});

test("it should handle single character file names", () => {
	const result = parseIncludeExampleTag("a[1]");
	expect(result.path).toBe("a");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		single: 1,
		isNegative: false,
	});
});

test("it should handle multiple selections with colon syntax", () => {
	const result = parseIncludeExampleTag("path/to/file[2:4,10,15:20]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.selections).toHaveLength(3);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "inclusion",
		start: 2,
		end: 4,
		isNegative: false,
	});
	expect(result.parsedSelector?.selections[1]).toEqual({
		type: "inclusion",
		single: 10,
		isNegative: false,
	});
	expect(result.parsedSelector?.selections[2]).toEqual({
		type: "inclusion",
		start: 15,
		end: 20,
		isNegative: false,
	});
});
