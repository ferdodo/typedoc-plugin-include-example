import { expect, test } from "vitest";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";
import { applyLineSelection } from "./applyLineSelection.js";
import { parseLineSelector } from "./parseLineSelector.js";

// Helper function to create parsed selectors for testing
function createParsedSelector(selector: string): ParsedLineSelector {
	return parseLineSelector(selector);
}

// ============= BASIC FUNCTIONALITY TESTS =============

test("It should return same content when no line selector is supplied", () => {
	const file = "hello\nthis\nis\na\nmultiline\nfile";
	const includeExampleFile = { path: "fake/file" };
	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual(file);
});

test("It should apply single line selection", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line3");
});

test("It should apply range selection", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("2:4"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line2\nline3\nline4");
});

test("It should throw when line is out of range", () => {
	const file = "hello\nthis\nis\na\nmultiline\nfile";

	const includeExampleFile = {
		path: "fake/file",
		parsedSelector: createParsedSelector("8"),
	};

	expect(() => applyLineSelection(file, includeExampleFile)).toThrowError(
		"Line 8 is out of range (file has 6 lines)",
	);
});

// ============= NEGATIVE INDEXING TESTS =============

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

// ============= OPEN-ENDED RANGE TESTS =============

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

test("It should apply negative open-ended range", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-3:"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line3\nline4\nline5"); // Last 3 lines
});

// ============= MULTIPLE SELECTIONS TESTS =============

test("It should apply multiple selections", () => {
	const file = "line1\nline2\nline3\nline4\nline5\nline6";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:2,5,6"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline5\nline6");
});

test("It should apply complex multiple selections", () => {
	const file = "line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:3,5:6,8"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3\nline5\nline6\nline8");
});

// ============= EXCLUSION TESTS =============

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
		parsedSelector: createParsedSelector("1:5,!-2"),
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

test("It should apply complex exclusion patterns", () => {
	const file =
		"line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:10,!3:5,!8,!-1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline6\nline7\nline9");
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
		parsedSelector: createParsedSelector("1"),
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

test("It should handle files with empty lines", () => {
	const file = "line1\n\nline3\n\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("2,4"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("\n");
});

test("It should handle out of bounds scenarios gracefully", () => {
	const file = "line1\nline2\nline3";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:10"), // Range beyond file
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3"); // Should clamp to available lines
});

test("It should handle negative ranges that resolve to empty", () => {
	const file = "line1\nline2";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-10"), // Single negative line beyond bounds
	};

	expect(() => applyLineSelection(file, includeExampleFile)).toThrowError(
		"Line -10 is out of range (file has 2 lines)",
	);
});

test("It should handle complex mixed positive and negative selections", () => {
	const file =
		"line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:3,-3:,-6:-4,!2,!-2"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline3\nline5\nline6\nline7\nline8\nline10");
});

// ============= WHITESPACE AND FORMATTING TESTS =============

test("It should preserve line content exactly", () => {
	const file = "  indented line  \n\ttab line\t\n  \n normal line";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:4"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("  indented line  \n\ttab line\t\n  \n normal line");
});

test("It should handle files ending with newlines", () => {
	const file = "line1\nline2\nline3\n";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("2:3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line2\nline3");
});

test("It should handle files with multiple consecutive newlines", () => {
	const file = "line1\n\n\nline4";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("2:3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("\n");
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

test("It should handle negative indexing on large files", () => {
	// Create a file with 500 lines
	const lines = Array.from({ length: 500 }, (_, i) => `line${i + 1}`);
	const file = lines.join("\n");

	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-10:-1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	const resultLines = result.split("\n");

	expect(resultLines).toHaveLength(10);
	expect(resultLines[0]).toBe("line491");
	expect(resultLines[9]).toBe("line500");
});

test("It should handle many exclusions efficiently", () => {
	// Create a file with 50 lines
	const lines = Array.from({ length: 50 }, (_, i) => `line${i + 1}`);
	const file = lines.join("\n");

	// Exclude every 5th line
	const exclusions = Array.from(
		{ length: 10 },
		(_, i) => `!${(i + 1) * 5}`,
	).join(",");
	const selector = `1:50,${exclusions}`;

	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector(selector),
	};

	const result = applyLineSelection(file, includeExampleFile);
	const resultLines = result.split("\n");

	// Should have 50 - 10 = 40 lines
	expect(resultLines).toHaveLength(40);
	expect(resultLines).not.toContain("line5");
	expect(resultLines).not.toContain("line10");
	expect(resultLines).not.toContain("line50");
});
