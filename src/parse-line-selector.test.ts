import { test, expect } from "vitest";
import { parseLineSelector } from "./parse-line-selector";

test("Should parse a line", function() {
	const result = parseLineSelector("15");
	expect(result).toEqual([15]);
});

test("Should parse a range of lines", function() {
	const result = parseLineSelector("2-4");
	expect(result).toEqual([2, 3, 4]);
});
