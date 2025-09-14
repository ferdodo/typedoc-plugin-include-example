import { expect, test } from "vitest";
import { weirdModulo } from "./weirdModulo.js";

test("One should be the first line", () => {
	expect(weirdModulo(1, 10)).toBe(1);
});

test("Ten should be the last line", () => {
	expect(weirdModulo(10, 10)).toBe(10);
});

test("Zero should be the first line (also)", () => {
	expect(weirdModulo(0, 10)).toBe(0);
});

test("-1 should be the last line", () => {
	expect(weirdModulo(-1, 10)).toBe(10);
});

test("out of range number should return valid line", () => {
	expect(weirdModulo(11, 10)).toBe(1);
});
