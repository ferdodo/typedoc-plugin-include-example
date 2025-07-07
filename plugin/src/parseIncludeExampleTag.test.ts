import { expect, test } from "vitest";
import { parseIncludeExampleTag } from "./parseIncludeExampleTag.js";

test("it should parse tag without file path", () => {
	const result = parseIncludeExampleTag("");
	expect(result.path).toBe("");
	expect(result.parsedSelector).toBeUndefined();
});

test("it should parse tag with file path only", () => {
	const result = parseIncludeExampleTag("path/to/file");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector).toBeUndefined();
});

test("it should parse tag with file path and single line", () => {
	const result = parseIncludeExampleTag("path/to/file[5]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector).toBeDefined();
	expect(result.parsedSelector?.selections).toHaveLength(1);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "single",
		isExclusion: false,
		line: 5,
	});
});

test("it should parse tag with file path and negative single line", () => {
	const result = parseIncludeExampleTag("path/to/file[-3]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector).toBeDefined();
	expect(result.parsedSelector?.selections).toHaveLength(1);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "single",
		isExclusion: false,
		line: -3,
	});
});

test("it should parse bracket syntax with colon ranges", () => {
	const result = parseIncludeExampleTag("path/to/file[2:8]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector).toBeDefined();
	expect(result.parsedSelector?.selections).toHaveLength(1);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 2,
		end: 8,
	});
});

test("it should parse open-ended ranges", () => {
	const result = parseIncludeExampleTag("path/to/file[5:]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 5,
		end: undefined,
	});
});

test("it should parse negative indexing in brackets", () => {
	const result = parseIncludeExampleTag("path/to/file[-5:]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.hasNegativeIndexing).toBe(true);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: -5,
		end: undefined,
	});
});

test("it should parse mixed positive/negative ranges", () => {
	const result = parseIncludeExampleTag("path/to/file[2:-5]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.hasNegativeIndexing).toBe(true);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 2,
		end: -5,
	});
});

test("it should parse exclusions", () => {
	const result = parseIncludeExampleTag("path/to/file[1:10,!5:7]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.hasExclusions).toBe(true);
	expect(result.parsedSelector?.selections).toHaveLength(2);
	expect(result.parsedSelector?.selections[1]).toEqual({
		type: "range",
		isExclusion: true,
		start: 5,
		end: 7,
	});
});

test("it should handle file paths with spaces", () => {
	const result = parseIncludeExampleTag("path with spaces/file.ts[5]");
	expect(result.path).toBe("path with spaces/file.ts");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "single",
		isExclusion: false,
		line: 5,
	});
});

test("it should handle file paths with dots", () => {
	const result = parseIncludeExampleTag("../parent/file.example.ts[2:4]");
	expect(result.path).toBe("../parent/file.example.ts");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 2,
		end: 4,
	});
});

test("it should handle relative paths with brackets", () => {
	const result = parseIncludeExampleTag("../parent/file.ts[5:]");
	expect(result.path).toBe("../parent/file.ts");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 5,
		end: undefined,
	});
});

test("it should handle absolute paths with brackets", () => {
	const result = parseIncludeExampleTag("/absolute/path/file.ts[:10]");
	expect(result.path).toBe("/absolute/path/file.ts");
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: undefined,
		end: 10,
	});
});

test("it should handle multiple selections with colon syntax", () => {
	const result = parseIncludeExampleTag("path/to/file[2:4,10,15:20]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.selections).toHaveLength(3);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 2,
		end: 4,
	});
	expect(result.parsedSelector?.selections[1]).toEqual({
		type: "single",
		isExclusion: false,
		line: 10,
	});
	expect(result.parsedSelector?.selections[2]).toEqual({
		type: "range",
		isExclusion: false,
		start: 15,
		end: 20,
	});
});

test("it should handle complex mixed selections", () => {
	const result = parseIncludeExampleTag("path/to/file[1:5,-3:,!2,!-1]");
	expect(result.path).toBe("path/to/file");
	expect(result.parsedSelector?.selections).toHaveLength(4);
	expect(result.parsedSelector?.selections[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 1,
		end: 5,
	});
	expect(result.parsedSelector?.selections[1]).toEqual({
		type: "range",
		isExclusion: false,
		start: -3,
		end: undefined,
	});
	expect(result.parsedSelector?.selections[2]).toEqual({
		type: "single",
		isExclusion: true,
		line: 2,
	});
	expect(result.parsedSelector?.selections[3]).toEqual({
		type: "single",
		isExclusion: true,
		line: -1,
	});
});

// Error cases
test("it should throw error on old dash syntax", () => {
	expect(() => parseIncludeExampleTag("path/to/file[2-4]")).toThrowError(
		/BREAKING CHANGE: The dash syntax/,
	);
});

test("it should throw error on invalid bracket syntax", () => {
	expect(() => parseIncludeExampleTag("path/to/file[invalid]")).toThrowError(
		"Invalid line number: invalid",
	);
});

test("it should throw error on zero line number", () => {
	expect(() => parseIncludeExampleTag("path/to/file[0]")).toThrowError(
		"Line number must be positive or negative, not zero",
	);
});

test("it should throw error on malformed brackets", () => {
	expect(() => parseIncludeExampleTag("path/to/file[")).toThrowError(
		"Malformed bracket syntax",
	);
});

test("it should throw error on empty brackets", () => {
	expect(() => parseIncludeExampleTag("path/to/file[]")).toThrowError(
		"Empty bracket syntax",
	);
});
