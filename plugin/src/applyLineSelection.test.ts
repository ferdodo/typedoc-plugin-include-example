import { expect, test } from "vitest";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";
import { applyLineSelection } from "./applyLineSelection.js";
import { parseLineSelector } from "./parseLineSelector.js";

// Helper function to create parsed selector
function createParsedSelector(selector: string): ParsedLineSelector {
	const result = parseLineSelector(selector);
	if (Array.isArray(result)) {
		throw new Error("Expected ParsedLineSelector but got number[]");
	}
	return result;
}

// ============= BACKWARDS COMPATIBILITY TESTS (Old lines array) =============

test("It should select lines from file", () => {
	const file = "hello\nthis\nis\na\nmultiline\nfile";

	const includeExampleFile = {
		path: "fake/file",
		lines: [2, 4, 6],
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("this\na\nfile");
});

test("It return same content when no line selector is supplied", () => {
	const file = "hello\nthis\nis\na\nmultiline\nfile";
	const includeExampleFile = { path: "fake/file" };
	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual(file);
});

test("It throw when line is out of range", () => {
	const file = "hello\nthis\nis\na\nmultiline\nfile";

	const includeExampleFile = {
		path: "fake/file",
		lines: [2, 4, 6, 8],
	};

	expect(() => applyLineSelection(file, includeExampleFile)).toThrowError(
		"Line number 8 is out of range for file fake/file",
	);
});

// ============= NEW PARSED SELECTOR TESTS =============

test("It should apply single line selection with new syntax", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("3:3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line3");
});

test("It should apply range selection with new syntax", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("2:4"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line2\nline3\nline4");
});

test("It should apply negative indexing", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-2"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line4"); // Second to last line
});

test("It should apply negative range", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-3:-1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line3\nline4\nline5"); // Last 3 lines
});

test("It should apply open-ended range from start", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("3:"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line3\nline4\nline5");
});

test("It should apply open-ended range to end", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector(":3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3");
});

test("It should apply multiple selections", () => {
	const file = "line1\nline2\nline3\nline4\nline5\nline6";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:2,5,6:6"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline5\nline6");
});

test("It should apply exclusions", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:5,!3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline4\nline5");
});

test("It should apply range exclusions", () => {
	const file = "line1\nline2\nline3\nline4\nline5\nline6\nline7";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:7,!3:5"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline6\nline7");
});

test("It should apply negative exclusions", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-5:,!-2"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3\nline5"); // All lines except second to last
});

test("It should handle implicit full range with exclusions", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("!2,!4"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline3\nline5");
});

// ============= EDGE CASES =============

test("It should handle empty files", () => {
	const file = "";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:5"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("");
});

test("It should handle single line files", () => {
	const file = "only line";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("only line");
});

test("It should handle single line with negative indexing", () => {
	const file = "only line";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("only line");
});

test("It should handle files with empty lines using new syntax", () => {
	const file = "line1\n\nline3\n\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("2:2,4:4"), // Use new syntax explicitly
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("\n"); // Empty lines 2 and 4
});

test("It should handle files ending with newline", () => {
	const file = "line1\nline2\nline3\n";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("2:4"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line2\nline3\n");
});

test("It should handle complex overlapping ranges and exclusions", () => {
	const file = "L1\nL2\nL3\nL4\nL5\nL6\nL7\nL8\nL9\nL10";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:10,3:7,!5,!8:9"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("L1\nL2\nL3\nL4\nL6\nL7\nL10"); // Combined ranges minus exclusions
});

// ============= ERROR HANDLING =============

test("It should throw when parsed selector results in out of range line", () => {
	const file = "line1\nline2\nline3";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("5:5"),
	};

	// The error message comes from resolveLineSelections, not applyLineSelection
	expect(() => applyLineSelection(file, includeExampleFile)).toThrowError(
		"Line 5 is out of range (file has 3 lines)",
	);
});

test("It should throw when negative indexing goes out of bounds", () => {
	const file = "line1\nline2";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-5"),
	};

	expect(() => applyLineSelection(file, includeExampleFile)).toThrowError(
		"Line -5 is out of range (file has 2 lines)",
	);
});

test("It should handle empty result from exclusions", () => {
	const file = "line1\nline2\nline3";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:3,!1:3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual(""); // All lines excluded
});

test("It should handle empty selector (no lines selected)", () => {
	const file = "line1\nline2\nline3";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector(""), // Empty selector returns all lines
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3"); // Empty selector means all lines selected
});

// ============= PERFORMANCE AND LARGE FILE TESTS =============

test("It should handle large line numbers efficiently", () => {
	// Create a file with 1000 lines
	const lines = Array.from({ length: 1000 }, (_, i) => `line${i + 1}`);
	const file = lines.join("\n");

	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("995:1000"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual(
		"line995\nline996\nline997\nline998\nline999\nline1000",
	);
});

test("It should handle complex selections on large files", () => {
	// Create a file with 100 lines
	const lines = Array.from({ length: 100 }, (_, i) => `line${i + 1}`);
	const file = lines.join("\n");

	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:10,50:60,90:100,!5,!55,!95"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	const resultLines = result.split("\n");

	// Should have 10 + 11 + 11 - 3 = 29 lines
	expect(resultLines).toHaveLength(29);
	expect(resultLines[0]).toBe("line1");
	expect(resultLines).not.toContain("line5");
	expect(resultLines).not.toContain("line55");
	expect(resultLines).not.toContain("line95");
});
