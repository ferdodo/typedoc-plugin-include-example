import { expect, test } from "vitest";
import { generateAndMountDocs } from "./generateAndMountDocs.js";

test("Should inject a title named 'Example'", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const title = container?.querySelector("h3");
	expect(title?.textContent).toContain("Example");
});

test("Should inject the line 4", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("// this line range");
});

test("Should inject the line 5", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("// shall be included");
});

test("Should inject the line 6", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("// in the example");
});

test("Previous line to the line range should not be included", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain(
		"// this previous line should not be in the docs",
	);
});

test("Next line to the specific line range shall not be in the doc", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("// this next line should not be in the docs");
});

test("Previous line to the line 10 should not be included", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("// line 10 is not included");
});

test("The line 10 should be included", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain(
		'const book = new Book("The Lord of the Rings", [chapter1, chapter2, chapter3]);',
	);
});

test("Next line to the line 10 should not be included", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("// line 12 is not included");
});

test("Previous line to the line 13 should not be included", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("// line 14 is not included");
});

test("The line 13 should be included", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("console.log(book.chapters.length); // 3");
});

test("Next line to the line 13 should not be included", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Chapter.ts"],
		htmlRelativePath: "classes/Chapter.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("// line after 13 is not included");
});
