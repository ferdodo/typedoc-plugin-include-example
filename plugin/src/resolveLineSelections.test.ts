import { expect, test } from "vitest";
import { resolveLineSelections } from "./resolveLineSelections.js";

test("Line selector with no selections should return all lines", () => {
	expect(resolveLineSelections([], 5)).toEqual([1, 2, 3, 4, 5]);
});

test("Line selector with only exclusions should return all lines except the excluded lines", () => {
	expect(
		resolveLineSelections([{ type: "single", isExclusion: true, line: 5 }], 5),
	).toEqual([1, 2, 3, 4]);
});

test("Should not include all lines if selector have both inclusions and exclusions", () => {
	expect(
		resolveLineSelections(
			[
				{ type: "single", isExclusion: true, line: 5 },
				{ type: "single", isExclusion: false, line: 3 },
			],
			5,
		),
	).toEqual([3]);
});
