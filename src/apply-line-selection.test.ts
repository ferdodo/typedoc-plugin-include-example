import { test, expect } from "vitest";
import { applyLineSelection } from "./apply-line-selection";

test("It should select lines from file", function() {
	const file = "hello\nthis\nis\na\nmultiline\nfile";

	const includeExampleFile = {
		file: "fake/file",
		lines: [2, 4, 6]
	};

	const result = applyLineSelection(file, includeExampleFile);
	expect(result).toEqual("this\na\nfile");
});
