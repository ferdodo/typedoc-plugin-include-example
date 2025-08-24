import { expect, test } from "vitest";
import { generateAndMountDocs } from "./generateAndMountDocs.js";

test("Should inject a title named 'Example'", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/BookStore.ts"],
		htmlRelativePath: "classes/BookStore.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const title = container?.querySelector("h3");
	expect(title?.textContent).toContain("Example");
});

test("Should handle exclusion syntax to exclude sensitive lines", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/BookStore.ts"],
		htmlRelativePath: "classes/BookStore.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("Initialize bookstore");
	expect(codeText).toContain("Add inventory");
});

test("Should exclude lines marked as sensitive pricing logic", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/BookStore.ts"],
		htmlRelativePath: "classes/BookStore.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("SENSITIVE: Pricing logic");
	expect(codeText).not.toContain("basePrice");
	expect(codeText).not.toContain("markup");
	expect(codeText).not.toContain("finalPrice");
});

test("Should include lines after the excluded range", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/BookStore.ts"],
		htmlRelativePath: "classes/BookStore.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("addToInventory");
});
