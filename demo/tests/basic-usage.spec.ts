import { expect, test } from "vitest";
import { generateAndMountDocs } from "./generateAndMountDocs.js";

test("Should inject a title named 'Example'", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Book.ts"],
		htmlRelativePath: "classes/Book.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const title = container?.querySelector("h3");
	expect(title?.textContent).toContain("Example");
});

test("Should inject the example code source", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Book.ts"],
		htmlRelativePath: "classes/Book.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain('const book = new Book("The Lord of the Rings");');
	expect(codeText).toContain("const frenchTitle = book.translateTitle();");
	expect(codeText).toContain(
		'console.log(frenchTitle); // "le Lord de le Rings"',
	);
});
