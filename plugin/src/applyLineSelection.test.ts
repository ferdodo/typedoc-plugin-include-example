import { expect, test } from "vitest";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";
import { applyLineSelection } from "./applyLineSelection.js";
import { parseLineSelector } from "./parseLineSelector.js";

// Helper function to create parsed selectors for testing
function createParsedSelector(selector: string): ParsedLineSelector {
	return parseLineSelector(selector);
}

// ============= BASIC TESTS =============

test("It should apply single line selection", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line3");
});

test("It should apply negative single line selection", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-2"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line4"); // Second to last line
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

test("It should apply negative range", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-3:-1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line3\nline4\nline5"); // Last 3 lines
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

test("It should apply open-ended range to negative end", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector(":-2"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3\nline4"); // All except last line
});

// ============= NEW: MIXED POSITIVE/NEGATIVE TESTS =============

test("It should apply mixed positive to negative range", () => {
	const file =
		"line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("3:-3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line3\nline4\nline5\nline6\nline7\nline8"); // Line 3 to line 8 (10 - 3 + 1 = 8)
});

test("It should apply mixed negative to positive range", () => {
	const file =
		"line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-7:4"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line4"); // Line 4 (10 - 7 + 1 = 4) to line 4, so just line 4
});

test("It should handle mixed range that results in empty selection", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("4:-1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line4\nline5"); // Line 4 to line 5 (5 - 1 + 1 = 5)
});

test("It should handle mixed range with reverse order", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-2:3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual(""); // Line 4 (5 - 2 + 1 = 4) to line 3, but 4 > 3, so empty
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

test("It should apply mixed positive and negative selections", () => {
	const file =
		"line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:3,-3:"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3\nline8\nline9\nline10");
});

// ============= EXCLUSION TESTS =============

test("It should apply single line exclusions", () => {
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
	const file = "line1\nline2\nline3\nline4\nline5\nline6\nline7";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:7,!-3:-1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3\nline4"); // Exclude last 3 lines
});

test("It should apply mixed positive/negative exclusions", () => {
	const file =
		"line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:10,!3:-3"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline9\nline10"); // Exclude lines 3-8
});

test("It should handle only exclusions (include all then exclude)", () => {
	const file = "line1\nline2\nline3\nline4\nline5";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("!2:4"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline5");
});

// ============= EDGE CASES =============

test("It should handle empty file", () => {
	const file = "";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:5"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("");
});

test("It should handle single line file", () => {
	const file = "onlyline";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("onlyline");
});

test("It should handle file with no parsedSelector", () => {
	const file = "line1\nline2\nline3";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: undefined,
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("line1\nline2\nline3");
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

// ============= ERROR CASES =============

test("It should throw error on out of range line", () => {
	const file = "line1\nline2\nline3";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("5"),
	};

	expect(() => applyLineSelection(file, includeExampleFile)).toThrowError(
		"Line 5 is out of range (file has 3 lines)",
	);
});

test("It should throw error on out of range negative line", () => {
	const file = "line1\nline2\nline3";
	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("-5"),
	};

	expect(() => applyLineSelection(file, includeExampleFile)).toThrowError(
		"Line -5 is out of range (file has 3 lines)",
	);
});

// ============= PERFORMANCE TESTS =============

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

test("It should handle mixed ranges on large files", () => {
	// Create a file with 1000 lines
	const lines = Array.from({ length: 1000 }, (_, i) => `line${i + 1}`);
	const file = lines.join("\n");

	const includeExampleFile = {
		path: "test/file",
		parsedSelector: createParsedSelector("1:10,500:510,!5,!505"),
	};

	const result = applyLineSelection(file, includeExampleFile);
	const resultLines = result.split("\n");

	// Should have lines 1-10 and 500-510, minus line 5 and line 505
	expect(resultLines).toHaveLength(19); // 10 + 11 - 2 = 19
	expect(resultLines[0]).toBe("line1");
	expect(resultLines).not.toContain("line5");
	expect(resultLines).not.toContain("line505");
	expect(resultLines).toContain("line500");
	expect(resultLines).toContain("line510");
});
