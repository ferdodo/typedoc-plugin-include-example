import path from "node:path";
import { expect, test } from "@playwright/test";

const filePath = `file://${path.join(
	process.cwd(),
	"docs/classes/Review.html",
)}`;

test("Should inject a title named 'Example'", async ({ page }) => {
	await page.goto(filePath);
	const title = page.getByRole("heading", { level: 3, name: "Example" });
	await expect(title).toBeVisible();
});

test("Should handle complex mixed syntax with ranges and exclusions", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should include the setup and processing sections
	await expect(code).toContainText("Setup review data");
	await expect(code).toContainText("Process review");
});

test("Should exclude validation section when using mixed syntax", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should not include the validation section (lines 6-10)
	await expect(code).not.toContainText("VALIDATION: Input sanitization");
	await expect(code).not.toContainText("Math.min(Math.max");
	await expect(code).not.toContainText("END VALIDATION SECTION");
});

test("Should include lines from specified ranges while excluding others", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should include the review creation and processing
	await expect(code).toContainText("Create review instance");
	await expect(code).toContainText("Processing review");

	// Should include the variable usage (even though definition was excluded)
	await expect(code).toContainText("sanitizedComment");

	// Should exclude the validation logic
	await expect(code).not.toContainText("Math.min(Math.max");
});
