import { expect, test } from "vitest";
import { applyLineSelection } from "./apply-line-selection.js";

test("It should select lines from file", () => {
	const file = "hello\nthis\nis\na\nmultiline\nfile";

	const includeExampleFile = {
		path: "fake/file",
		lines: [2, 4, 6],
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("this\na\nfile");
});

test("It return same content when no line selector is supplied", () => {
	const file = "hello\nthis\nis\na\nmultiline\nfile";
	const includeExampleFile = { path: "fake/file" };
	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual(file);
});

test("It throw when line is out of range", () => {
	const file = "hello\nthis\nis\na\nmultiline\nfile";

	const includeExampleFile = {
		path: "fake/file",
		lines: [2, 4, 6, 8],
	};

	expect(() => applyLineSelection(file, includeExampleFile)).toThrowError(
		"Line number 8 is out of range for file fake/file",
	);
});
