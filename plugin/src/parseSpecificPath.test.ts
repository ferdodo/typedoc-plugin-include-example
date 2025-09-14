import { expect, test } from "vitest";
import { parseSpecificPath } from "./parseSpecificPath.js";

test("Should extract specific path", () => {
	expect(parseSpecificPath("greet.example.ts[5]")).toEqual("greet.example.ts");
});

test("Should extract specific path that has multiple digit line selector", () => {
	expect(parseSpecificPath("greet.example.ts[50]")).toEqual("greet.example.ts");
});

test("Should extract specific path without line selector", () => {
	expect(parseSpecificPath("greet.example.ts")).toEqual("greet.example.ts");
});

test("Should not parse invalid empty bracket", () => {
	expect(parseSpecificPath("greet.example.ts[]")).toEqual(undefined);
});

test("Should not parse selector without path", () => {
	expect(parseSpecificPath("[5]")).toEqual(undefined);
});

test("Should not parse path starting with a selector", () => {
	expect(parseSpecificPath("[5]greet.example.ts[50]")).toEqual(undefined);
});
