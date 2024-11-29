import { expect, test } from "vitest";
import { parseLineSelector } from "./parse-line-selector.js";

test("Should parse a line", () => {
	const result = parseLineSelector("15");
	expect(result).toEqual([15]);
});

test("Should parse a when equal to 1", () => {
	const result = parseLineSelector("1");
	expect(result).toEqual([1]);
});

test("Should parse a range of lines", () => {
	const result = parseLineSelector("2-4");
	expect(result).toEqual([2, 3, 4]);
});

test("Should parse a range of lines starting with 1", () => {
	const result = parseLineSelector("1-4");
	expect(result).toEqual([1, 2, 3, 4]);
});

test("Should throw error on missing range start", () => {
	expect(() => parseLineSelector("-4")).toThrowError(
		"Failed to parse range start !",
	);
});

test("Should throw error on missing range end", () => {
	expect(() => parseLineSelector("2-")).toThrowError(
		"Failed to parse range end !",
	);
});

test("Should throw error on bad range start", () => {
	expect(() => parseLineSelector("bad-4")).toThrowError(
		"Failed to parse range start !",
	);
});

test("Should throw error on bad range end", () => {
	expect(() => parseLineSelector("2-bad")).toThrowError(
		"Failed to parse range end !",
	);
});

test("Should throw error on end being smaller than start", () => {
	expect(() => parseLineSelector("4-2")).toThrowError(
		"Range start is greater or equal to range end !",
	);
});

test("Should throw error on end being equal to start", () => {
	expect(() => parseLineSelector("2-2")).toThrowError(
		"Range start is greater or equal to range end !",
	);
});

test("Should throw error on start being smaller than 1", () => {
	expect(() => parseLineSelector("0-2")).toThrowError(
		"Range start not positive !",
	);
});

test("Should throw error on bad single line", () => {
	expect(() => parseLineSelector("bad")).toThrowError(
		"Failed to parse line number !",
	);
});
