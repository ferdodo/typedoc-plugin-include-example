import { expect, test } from "vitest";
import { generateAndMountDocs } from "./generateAndMountDocs.js";

test("Should inject a title named 'Example'", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Review.ts"],
		htmlRelativePath: "classes/Review.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const title = container?.querySelector("h3");
	expect(title?.textContent).toContain("Example");
});

test("Should handle complex mixed syntax with ranges and exclusions", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Review.ts"],
		htmlRelativePath: "classes/Review.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("Setup review data");
	expect(codeText).toContain("Process review");
});

test("Should exclude validation section when using mixed syntax", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Review.ts"],
		htmlRelativePath: "classes/Review.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("VALIDATION: Input sanitization");
	expect(codeText).not.toContain("Math.min(Math.max");
	expect(codeText).not.toContain("END VALIDATION SECTION");
});

test("Should include lines from specified ranges while excluding others", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Review.ts"],
		htmlRelativePath: "classes/Review.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("Create review instance");
	expect(codeText).toContain("Processing review");
	expect(codeText).toContain("sanitizedComment");
	expect(codeText).not.toContain("Math.min(Math.max");
});
