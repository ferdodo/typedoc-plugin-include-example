import { expect, test } from "vitest";
import { parseLineSelector } from "./parseLineSelector.js";
import { resolveLineSelections } from "./resolveLineSelections.js";

test("Should parse single line", () => {
	const result = parseLineSelector("5");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "single",
		isExclusion: false,
		line: 5,
	});
});

test("Should parse negative single line", () => {
	const result = parseLineSelector("-3");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "single",
		isExclusion: false,
		line: -3,
	});
});

test("Should parse single line exclusion", () => {
	const result = parseLineSelector("!5");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "single",
		isExclusion: true,
		line: 5,
	});
});

test("Should parse negative single line exclusion", () => {
	const result = parseLineSelector("!-3");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "single",
		isExclusion: true,
		line: -3,
	});
});

test("Should parse open-ended range from start", () => {
	const result = parseLineSelector("5:");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 5,
		end: undefined,
	});
});

test("Should parse open-ended range to end", () => {
	const result = parseLineSelector(":10");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: undefined,
		end: 10,
	});
});

test("Should parse closed range", () => {
	const result = parseLineSelector("2:8");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 2,
		end: 8,
	});
});

test("Should parse negative range", () => {
	const result = parseLineSelector("-10:-5");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: -10,
		end: -5,
	});
});

test("Should parse negative open-ended range", () => {
	const result = parseLineSelector("-5:");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: -5,
		end: undefined,
	});
});

test("Should parse open-ended range to negative end", () => {
	const result = parseLineSelector(":-3");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: undefined,
		end: -3,
	});
});

test("Should parse mixed positive start to negative end", () => {
	const result = parseLineSelector("2:-5");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 2,
		end: -5,
	});
});

test("Should parse mixed negative start to positive end", () => {
	const result = parseLineSelector("-8:5");
	expect(result).toHaveLength(1);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: -8,
		end: 5,
	});
});

test("Should parse multiple selections", () => {
	const result = parseLineSelector("2:5,10,15:20");
	expect(result).toHaveLength(3);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 2,
		end: 5,
	});
	expect(result[1]).toEqual({
		type: "single",
		isExclusion: false,
		line: 10,
	});
	expect(result[2]).toEqual({
		type: "range",
		isExclusion: false,
		start: 15,
		end: 20,
	});
});

test("Should parse range exclusions", () => {
	const result = parseLineSelector("1:20,!8:12");
	expect(result).toHaveLength(2);
	expect(result[0]).toEqual({
		type: "range",
		isExclusion: false,
		start: 1,
		end: 20,
	});
	expect(result[1]).toEqual({
		type: "range",
		isExclusion: true,
		start: 8,
		end: 12,
	});
});

test("Should parse negative exclusions", () => {
	const result = parseLineSelector("1:20,!-5:-2");
	expect(result).toHaveLength(2);
	expect(result[1]).toEqual({
		type: "range",
		isExclusion: true,
		start: -5,
		end: -2,
	});
});

test("Should parse mixed positive/negative exclusions", () => {
	const result = parseLineSelector("1:20,!2:-3");
	expect(result).toHaveLength(2);
	expect(result[1]).toEqual({
		type: "range",
		isExclusion: true,
		start: 2,
		end: -3,
	});
});

test("Should throw error on invalid line number", () => {
	expect(() => parseLineSelector("abc")).toThrowError(
		"Invalid line number: abc",
	);
});

test("Should throw error on zero line number", () => {
	expect(() => parseLineSelector("0")).toThrowError(
		"line number must be positive or negative, not zero",
	);
});

test("Should throw error on zero range start", () => {
	expect(() => parseLineSelector("0:10")).toThrowError(
		"range start must be positive or negative, not zero",
	);
});

test("Should throw error on zero range end", () => {
	expect(() => parseLineSelector("5:0")).toThrowError(
		"range end must be positive or negative, not zero",
	);
});

test("Should throw error on invalid range start", () => {
	expect(() => parseLineSelector("abc:10")).toThrowError(
		"Invalid range start: abc",
	);
});

test("Should throw error on invalid range end", () => {
	expect(() => parseLineSelector("5:xyz")).toThrowError(
		"Invalid range end: xyz",
	);
});

test("Should throw error on old dash syntax", () => {
	expect(() => parseLineSelector("2-4")).toThrowError(
		"BREAKING CHANGE: The dash syntax '2-4' inside brackets is no longer supported",
	);
});

test("Should throw error on old dash syntax with multiple selections", () => {
	expect(() => parseLineSelector("2-4,10")).toThrowError(
		"BREAKING CHANGE: The dash syntax '2-4,10' inside brackets is no longer supported",
	);
});

test("Should allow negative numbers (not old dash syntax)", () => {
	expect(() => parseLineSelector("-5")).not.toThrow();
});

test("Should handle empty selector", () => {
	expect(parseLineSelector("")).toHaveLength(0);
});

test("Should handle colon-only selector", () => {
	expect(parseLineSelector(":")).toHaveLength(0);
});

test("Should resolve basic range", () => {
	const parsed = parseLineSelector("2:5");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([2, 3, 4, 5]);
});

test("Should resolve single line", () => {
	const parsed = parseLineSelector("7");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([7]);
});

test("Should resolve negative single line", () => {
	const parsed = parseLineSelector("-2");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([9]); // 10 - 2 + 1 = 9
});

test("Should resolve negative ranges correctly", () => {
	const parsed = parseLineSelector("-5:-2");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([6, 7, 8, 9]); // Lines 6-9 (last 4 lines excluding last line)
});

test("Should resolve mixed positive to negative range", () => {
	const parsed = parseLineSelector("2:-5");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([2, 3, 4, 5, 6]); // Line 2 to line 6 (10 - 5 + 1 = 6)
});

test("Should resolve mixed negative to positive range", () => {
	const parsed = parseLineSelector("-8:5");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([3, 4, 5]); // Line 3 (10 - 8 + 1 = 3) to line 5
});

test("Should resolve complex mixed selections", () => {
	const parsed = parseLineSelector("1:3,5,-2:,!7");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([1, 2, 3, 5, 9, 10]); // 1-3, 5, 9-10 (last 2), excluding 7
});

test("Should resolve mixed positive and negative", () => {
	const parsed = parseLineSelector("2:5,-3:");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([2, 3, 4, 5, 8, 9, 10]);
});

test("Should handle mixed range that results in valid selection", () => {
	const parsed = parseLineSelector("8:-2");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([8, 9]); // Line 8 to line 9 (10 - 2 + 1 = 9)
});

test("Should handle mixed range with exclusions", () => {
	const parsed = parseLineSelector("1:-1,!3:-3");
	const resolved = resolveLineSelections(parsed, 10);
	expect(resolved).toEqual([1, 2, 9, 10]); // Lines 1-10, excluding lines 3-8 (since -3 = line 8)
});

test("Should throw error on out of range single line", () => {
	const parsed = parseLineSelector("15");
	expect(() => resolveLineSelections(parsed, 10)).toThrowError(
		"Line 15 is out of range (file has 10 lines)",
	);
});

test("Should throw error on out of range negative single line", () => {
	const parsed = parseLineSelector("-15");
	expect(() => resolveLineSelections(parsed, 10)).toThrowError(
		"Line -15 is out of range (file has 10 lines)",
	);
});
