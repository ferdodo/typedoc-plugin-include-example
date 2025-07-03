import { expect, test } from "vitest";
import { parseLineSelector } from "./parseLineSelector.js";
import { resolveLineSelections } from "./resolveLineSelections.js";

// ============= BREAKING CHANGE TESTS (Old Dash Syntax) =============

test("Should throw error for old dash syntax single range", () => {
	expect(() => parseLineSelector("2-4")).toThrowError(
		/BREAKING CHANGE: The dash syntax '2-4' inside brackets is no longer supported in v3\.0\.0\+/,
	);
});

test("Should throw error for old dash syntax multiple selectors", () => {
	expect(() => parseLineSelector("2-4,15")).toThrowError(
		/BREAKING CHANGE: The dash syntax '2-4,15' inside brackets is no longer supported in v3\.0\.0\+/,
	);
});

test("Should throw error for old dash syntax with exclusions", () => {
	expect(() => parseLineSelector("2-4,!6-8")).toThrowError(
		/BREAKING CHANGE: The dash syntax '2-4,!6-8' inside brackets is no longer supported in v3\.0\.0\+/,
	);
});

// ============= NEW BRACKET SYNTAX TESTS =============

// Single line tests
test("Should parse single positive line", () => {
	const result = parseLineSelector("10");
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		single: 10,
		isNegative: false,
	});
	expect(result.hasNegativeIndexing).toBe(false);
	expect(result.hasExclusions).toBe(false);
});

test("Should parse single negative line", () => {
	const result = parseLineSelector("-5");
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
	const result = parseLineSelector("5:");
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 5,
		end: undefined,
		isNegative: false,
	});
});

test("Should parse open-ended range to end", () => {
	const result = parseLineSelector(":10");
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: undefined,
		end: 10,
		isNegative: false,
	});
});

test("Should parse closed range", () => {
	const result = parseLineSelector("2:8");
	expect(result.selections).toHaveLength(1);
	expect(result.selections[0]).toEqual({
		type: "inclusion",
		start: 2,
		end: 8,
		isNegative: false,
	});
});

test("Should parse negative range", () => {
	const result = parseLineSelector("-10:-5");
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
	const result = parseLineSelector("-5:");
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
	const result = parseLineSelector("2:5,10,15:20");
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
	const result = parseLineSelector("1:10,!5:7");
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
	const result = parseLineSelector(":10,!5");
	expect(result.selections).toHaveLength(2);
	expect(result.selections[1]).toEqual({
		type: "exclusion",
		single: 5,
		isNegative: false,
	});
	expect(result.hasExclusions).toBe(true);
});

test("Should parse negative exclusions", () => {
	const result = parseLineSelector("1:20,!-5:-2");
	expect(result.selections).toHaveLength(2);
	expect(result.selections[1]).toEqual({
		type: "exclusion",
		start: 5,
		end: 2,
		isNegative: true,
	});
	expect(result.hasNegativeIndexing).toBe(true);
	expect(result.hasExclusions).toBe(true);
});

// Empty and special cases
test("Should handle empty selector", () => {
	const result = parseLineSelector("");
	expect(result.selections).toHaveLength(0);
	expect(result.hasNegativeIndexing).toBe(false);
	expect(result.hasExclusions).toBe(false);
});

test("Should handle colon-only selector", () => {
	const result = parseLineSelector(":");
	expect(result.selections).toHaveLength(0);
	expect(result.hasNegativeIndexing).toBe(false);
	expect(result.hasExclusions).toBe(false);
});

// Error handling
test("Should throw error on invalid line number", () => {
	expect(() => parseLineSelector("bad")).toThrowError(
		"Invalid line number: bad",
	);
});

test("Should throw error on invalid range start", () => {
	expect(() => parseLineSelector("bad:10")).toThrowError(
		"Invalid range start: bad",
	);
});

test("Should throw error on invalid range end", () => {
	expect(() => parseLineSelector("5:bad")).toThrowError(
		"Invalid range end: bad",
	);
});

test("Should throw error on zero range start", () => {
	expect(() => parseLineSelector("0:10")).toThrowError(
		"Range start must be positive or negative, not zero",
	);
});

test("Should throw error on zero range end", () => {
	expect(() => parseLineSelector("5:0")).toThrowError(
		"Range end must be positive or negative, not zero",
	);
});

test("Should throw error on invalid positive range", () => {
	expect(() => parseLineSelector("10:5")).toThrowError(
		"Range start (10) must be less than or equal to range end (5)",
	);
});

// ============= RESOLUTION TESTS =============

test("Should resolve basic range", () => {
	const parsed = parseLineSelector("2:5");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([2, 3, 4, 5]);
});

test("Should resolve negative indexing", () => {
	const parsed = parseLineSelector("-3:");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([8, 9, 10]);
});

test("Should resolve exclusions", () => {
	const parsed = parseLineSelector("1:10,!5:7");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([1, 2, 3, 4, 8, 9, 10]);
});

test("Should resolve complex mixed syntax", () => {
	const parsed = parseLineSelector("2:8,15,20:25,!5:6,!22");
	const resolved = resolveLineSelections(parsed, 30);
	expect(resolved).toEqual([2, 3, 4, 7, 8, 15, 20, 21, 23, 24, 25]);
});

test("Should handle out of bounds negative indexing", () => {
	const parsed = parseLineSelector("-15");
	expect(() => resolveLineSelections(parsed, 10)).toThrowError(
		"Line -15 is out of range (file has 10 lines)",
	);
});

test("Should handle empty file", () => {
	const parsed = parseLineSelector("1:5");
	const resolved = resolveLineSelections(parsed, 0);
	expect(resolved).toEqual([]);
});

test("Should handle single line file", () => {
	const parsed = parseLineSelector("1:5");
	const resolved = resolveLineSelections(parsed, 1);
	expect(resolved).toEqual([1]);
});

test("Should resolve only exclusions (include all then exclude)", () => {
	const parsed = parseLineSelector("!3:5");
	const resolved = resolveLineSelections(parsed, 7);
	expect(resolved).toEqual([1, 2, 6, 7]);
});

test("Should resolve negative ranges correctly", () => {
	const parsed = parseLineSelector("-5:-2");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([6, 7, 8, 9]);
});

test("Should resolve mixed positive and negative", () => {
	const parsed = parseLineSelector("2:5,-3:");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([2, 3, 4, 5, 8, 9, 10]);
});

test("Should handle whitespace in selectors", () => {
	const parsed = parseLineSelector(" 2:5 , 10 , !7 ");
	const resolved = resolveLineSelections(parsed, 15);
	expect(resolved).toEqual([2, 3, 4, 5, 10]);
});
