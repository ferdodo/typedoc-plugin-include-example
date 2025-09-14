import { expect, test } from "vitest";
import { resolveRange } from "./resolveRange.js";

test("Should select all last lines when end is not specified", () => {
	expect([
		...resolveRange(
			{
				type: "range",
				isExclusion: false,
				start: 10,
			},
			20,
		),
	]).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
});

test("Should select the last line", () => {
	expect([
		...resolveRange(
			{
				type: "range",
				isExclusion: false,
				start: -1,
			},
			20,
		),
	]).toEqual([20]);
});

test("Should select the first line", () => {
	expect([
		...resolveRange(
			{
				type: "range",
				isExclusion: false,
				start: 1,
				end: 2,
			},
			20,
		),
	]).toEqual([1, 2]);
});
