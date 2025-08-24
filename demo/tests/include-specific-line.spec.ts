import { expect, test } from "vitest";
import { generateAndMountDocs } from "./generateAndMountDocs.js";

test("Should inject a title named 'Example'", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Author.ts"],
		htmlRelativePath: "classes/Author.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const title = container?.querySelector("h3");
	expect(title?.textContent).toContain("Example");
});

test("Should inject the specific line", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Author.ts"],
		htmlRelativePath: "classes/Author.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("only this line shall be included in the docs");
});

test("Previous line to the specific line shall not be in the doc", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Author.ts"],
		htmlRelativePath: "classes/Author.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain(
		"this previous line should not be in the docs",
	);
});

test("Next line to the specific line shall not be in the doc", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Author.ts"],
		htmlRelativePath: "classes/Author.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("this next line should not be in the docs");
});
