import { expect, test } from "vitest";
import { generateAndMountDocs } from "./generateAndMountDocs.js";

test("Should inject a title named 'Example'", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Library.ts"],
		htmlRelativePath: "classes/Library.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const title = container?.querySelector("h3");
	expect(title?.textContent).toContain("Example");
});

test("Should inject the line 4", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Library.ts"],
		htmlRelativePath: "classes/Library.html",
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
		entryPoints: ["src/Library.ts"],
		htmlRelativePath: "classes/Library.html",
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
		entryPoints: ["src/Library.ts"],
		htmlRelativePath: "classes/Library.html",
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
		entryPoints: ["src/Library.ts"],
		htmlRelativePath: "classes/Library.html",
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
		entryPoints: ["src/Library.ts"],
		htmlRelativePath: "classes/Library.html",
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
