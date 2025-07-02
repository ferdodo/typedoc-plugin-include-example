import { expect, test } from "vitest";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";
import { parseLineSelector } from "./parseLineSelector.js";
import { resolveLineSelections } from "./resolveLineSelections.js";

// ============= BACKWARDS COMPATIBILITY TESTS (Old Dash Syntax) =============

test("Should parse a line (old syntax)", () => {
	const result = parseLineSelector("15");
	expect(Array.isArray(result)).toBe(true);
	expect(result).toEqual([15]);
});

test("Should parse a line when equal to 1 (old syntax)", () => {
	const result = parseLineSelector("1");
	expect(Array.isArray(result)).toBe(true);
	expect(result).toEqual([1]);
});

test("Should parse a range of lines (old syntax)", () => {
	const result = parseLineSelector("2-4");
	expect(Array.isArray(result)).toBe(true);
	expect(result).toEqual([2, 3, 4]);
});

test("Should parse a range of lines starting with 1 (old syntax)", () => {
	const result = parseLineSelector("1-4");
	expect(Array.isArray(result)).toBe(true);
	expect(result).toEqual([1, 2, 3, 4]);
});

test("Should throw error on missing range start (old syntax)", () => {
	expect(() => parseLineSelector("x-4")).toThrowError(
		"Failed to parse range start !",
	);
});

test("Should throw error on missing range end (old syntax)", () => {
	expect(() => parseLineSelector("2-")).toThrowError(
		"Failed to parse range end !",
	);
});

test("Should throw error on bad range start (old syntax)", () => {
	expect(() => parseLineSelector("bad-4")).toThrowError(
		"Failed to parse range start !",
	);
});

test("Should throw error on bad range end (old syntax)", () => {
	expect(() => parseLineSelector("2-bad")).toThrowError(
		"Failed to parse range end !",
	);
});

test("Should throw error on end being smaller than start (old syntax)", () => {
	expect(() => parseLineSelector("4-2")).toThrowError(
		"Range start is greater or equal to range end !",
	);
});

test("Should throw error on end being equal to start (old syntax)", () => {
	expect(() => parseLineSelector("2-2")).toThrowError(
		"Range start is greater or equal to range end !",
	);
});

test("Should throw error on start being smaller than 1 (old syntax)", () => {
	expect(() => parseLineSelector("0-2")).toThrowError(
		"Range start not positive !",
	);
});

test("Should throw error on bad single line (old syntax)", () => {
	expect(() => parseLineSelector("bad")).toThrowError(
		"Invalid line number: bad",
	);
});

// ============= NEW PYTHON-LIKE SYNTAX TESTS =============

// Helper function to get ParsedLineSelector from result
function getParsedSelector(
	result: number[] | ParsedLineSelector,
): ParsedLineSelector {
	if (Array.isArray(result)) {
		throw new Error("Expected ParsedLineSelector but got number[]");
	}
	return result;
}

// Single line tests
test("Should parse single positive line with colon syntax", () => {
	const result = getParsedSelector(parseLineSelector("10:10"));
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 10,
		end: 10,
		isNegative: false,
	});
	expect(result.hasNegativeIndexing).toBe(false);
	expect(result.hasExclusions).toBe(false);
});

test("Should parse single negative line", () => {
	const result = getParsedSelector(parseLineSelector("-5"));
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		single: 5,
		isNegative: true,
	});
	expect(result.hasNegativeIndexing).toBe(true);
	expect(result.hasExclusions).toBe(false);
});

// Range tests
test("Should parse open-ended range from start", () => {
	const result = getParsedSelector(parseLineSelector("5:"));
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 5,
		end: undefined,
		isNegative: false,
	});
});

test("Should parse open-ended range to end", () => {
	const result = getParsedSelector(parseLineSelector(":10"));
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: undefined,
		end: 10,
		isNegative: false,
	});
});

test("Should parse closed range", () => {
	const result = getParsedSelector(parseLineSelector("2:8"));
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 2,
		end: 8,
		isNegative: false,
	});
});

test("Should parse negative range", () => {
	const result = getParsedSelector(parseLineSelector("-10:-5"));
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 10,
		end: 5,
		isNegative: true,
	});
	expect(result.hasNegativeIndexing).toBe(true);
});

test("Should parse negative open-ended range", () => {
	const result = getParsedSelector(parseLineSelector("-5:"));
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 5,
		end: undefined,
		isNegative: true,
	});
	expect(result.hasNegativeIndexing).toBe(true);
});

// Multiple selections
test("Should parse multiple selections", () => {
	const result = getParsedSelector(parseLineSelector("2:5,10,15:20"));
	expect(result.selections).toHaveLength(3);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 2,
		end: 5,
		isNegative: false,
	});
	expect(result.selections[1]).toEqual({
		type: "inclusion",
		single: 10,
		isNegative: false,
	});
	expect(result.selections[2]).toEqual({
		type: "inclusion",
		start: 15,
		end: 20,
		isNegative: false,
	});
});

// Exclusion tests
test("Should parse exclusions", () => {
	const result = getParsedSelector(parseLineSelector("1:10,!5:7"));
	expect(result.selections).toHaveLength(2);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 1,
		end: 10,
		isNegative: false,
	});
	expect(result.selections[1]).toEqual({
		type: "exclusion",
		start: 5,
		end: 7,
		isNegative: false,
	});
	expect(result.hasExclusions).toBe(true);
});

test("Should parse single line exclusion", () => {
	const result = getParsedSelector(parseLineSelector("1:10,!5"));
	expect(result.selections).toHaveLength(2);
	expect(result.selections[1]).toEqual({
		type: "exclusion",
		single: 5,
		isNegative: false,
	});
	expect(result.hasExclusions).toBe(true);
});

// Empty selector tests
test("Should handle empty selector", () => {
	const result = getParsedSelector(parseLineSelector(""));
	expect(result.selections).toHaveLength(0);
	expect(result.hasNegativeIndexing).toBe(false);
	expect(result.hasExclusions).toBe(false);
});

test("Should handle colon-only selector", () => {
	const result = getParsedSelector(parseLineSelector(":"));
	expect(result.selections).toHaveLength(0);
	expect(result.hasNegativeIndexing).toBe(false);
	expect(result.hasExclusions).toBe(false);
});

// Error handling tests
test("Should throw error on invalid line number", () => {
	expect(() => parseLineSelector("abc")).toThrowError(
		"Invalid line number: abc",
	);
});

test("Should throw error on invalid range start", () => {
	expect(() => parseLineSelector("abc:5")).toThrowError(
		"Invalid range start: abc",
	);
});

test("Should throw error on invalid range end", () => {
	expect(() => parseLineSelector("5:abc")).toThrowError(
		"Invalid range end: abc",
	);
});

test("Should throw error on zero in range", () => {
	expect(() => parseLineSelector("0:5")).toThrowError(
		"Range start must be positive or negative, not zero",
	);
});

test("Should throw error on invalid positive range", () => {
	expect(() => parseLineSelector("5:3")).toThrowError(
		"Range start (5) must be less than or equal to range end (3)",
	);
});

// ============= LINE RESOLUTION TESTS =============

test("Should resolve single positive line", () => {
	const parsed = getParsedSelector(parseLineSelector("5:5"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([5]);
});

test("Should resolve single negative line", () => {
	const parsed = getParsedSelector(parseLineSelector("-2"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([9]); // 10 - 2 + 1 = 9
});

test("Should resolve range", () => {
	const parsed = getParsedSelector(parseLineSelector("3:6"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([3, 4, 5, 6]);
});

test("Should resolve open-ended range from start", () => {
	const parsed = getParsedSelector(parseLineSelector("8:"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([8, 9, 10]);
});

test("Should resolve open-ended range to end", () => {
	const parsed = getParsedSelector(parseLineSelector(":3"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([1, 2, 3]);
});

test("Should resolve negative range", () => {
	const parsed = getParsedSelector(parseLineSelector("-5:-2"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([6, 7, 8, 9]); // Lines 6-9 (10-5+1 to 10-2+1)
});

test("Should resolve multiple selections", () => {
	const parsed = getParsedSelector(parseLineSelector("2:4,8,10"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([2, 3, 4, 8, 10]);
});

test("Should resolve exclusions", () => {
	const parsed = getParsedSelector(parseLineSelector("1:10,!5:7"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([1, 2, 3, 4, 8, 9, 10]);
});

test("Should resolve exclusions with all lines implicit", () => {
	const parsed = getParsedSelector(parseLineSelector("!3,!7"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([1, 2, 4, 5, 6, 8, 9, 10]);
});

test("Should handle out of bounds positive line", () => {
	const parsed = getParsedSelector(parseLineSelector("15:15"));
	expect(() => resolveLineSelections(parsed, 10)).toThrowError(
		"Line 15 is out of range (file has 10 lines)",
	);
});

test("Should handle out of bounds negative line", () => {
	const parsed = getParsedSelector(parseLineSelector("-15"));
	expect(() => resolveLineSelections(parsed, 10)).toThrowError(
		"Line -15 is out of range (file has 10 lines)",
	);
});

test("Should handle empty file", () => {
	const parsed = getParsedSelector(parseLineSelector("5:5"));
	const result = resolveLineSelections(parsed, 0);
	expect(result).toEqual([]);
});

test("Should resolve with bounds clamping for ranges", () => {
	const parsed = getParsedSelector(parseLineSelector("8:15"));
	const result = resolveLineSelections(parsed, 10);
	expect(result).toEqual([8, 9, 10]); // Clamped to file bounds
});
