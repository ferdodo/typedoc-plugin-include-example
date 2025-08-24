import { expect, test } from "vitest";
import { generateAndMountDocs } from "./generateAndMountDocs.js";

test("Should inject a title named 'Example'", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Magazine.ts"],
		htmlRelativePath: "classes/Magazine.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const title = container?.querySelector("h3");
	expect(title?.textContent).toContain("Example");
});

test("Should handle open-ended range syntax to include first 11 lines", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Magazine.ts"],
		htmlRelativePath: "classes/Magazine.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).toContain("Magazine header setup");
	expect(codeText).toContain("Literary Quarterly");
	expect(codeText).toContain("End of header processing section");
});

test("Should exclude lines after the open-ended range", async () => {
	const testId = await generateAndMountDocs({
		entryPoints: ["src/Magazine.ts"],
		htmlRelativePath: "classes/Magazine.html",
	});

	const container = document.querySelector(`[data-testid="${testId}"]`);
	expect(container).not.toBeNull();

	const codeBlocks = container?.querySelectorAll("code");
	expect(codeBlocks?.length).toBeGreaterThan(0);

	const codeText = Array.from(codeBlocks || [])
		.map((block) => block.textContent)
		.join(" ");

	expect(codeText).not.toContain("Content processing section starts here");
	expect(codeText).not.toContain("Add articles to magazine");
});
