import { expect, test } from "vitest";
import { generateAndMountDocs } from "./generateAndMountDocs.js";

test("Should inject a title named 'Example'", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Publisher.ts"],
		htmlRelativePath: "classes/Publisher.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const title = container?.querySelector("h3");
	expect(title?.textContent).toContain("Example");
});

test("Should handle negative indexing syntax to include last 5 lines", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Publisher.ts"],
		htmlRelativePath: "classes/Publisher.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("Final publishing steps");
	expect(codeText).toContain("Finalizing publication process");
	expect(codeText).toContain("Publication complete");
});

test("Should exclude earlier lines when using negative indexing", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Publisher.ts"],
		htmlRelativePath: "classes/Publisher.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("Initialize publisher");
	expect(codeText).not.toContain("Add books to catalog");
});
