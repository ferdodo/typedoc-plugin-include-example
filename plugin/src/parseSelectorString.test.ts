import { expect, test } from "vitest";
import { parseSelectorString } from "./parseSelectorString.js";

test("Should extract line selector", () => {
	expect(parseSelectorString("greet.example.ts[5]")).toEqual("5");
});

test("Should extract line selector with multiple digits", () => {
	expect(parseSelectorString("greet.example.ts[50]")).toEqual("50");
});

test("Should be undefined when no selector", () => {
	expect(parseSelectorString("greet.example.ts")).toEqual(undefined);
});

test("Should not parse invalid empty bracket", () => {
	expect(parseSelectorString("greet.example.ts[]")).toEqual(undefined);
});

test("Should not parse selector without path", () => {
	expect(parseSelectorString("[5]")).toEqual(undefined);
});

test("Should not parse path starting with a selector", () => {
	expect(parseSelectorString("[5]greet.example.ts[50]")).toEqual(undefined);
});

test("Should not parse line selector with extra text after", () => {
	expect(parseSelectorString("greet.example.ts[5] text")).toEqual(undefined);
});
