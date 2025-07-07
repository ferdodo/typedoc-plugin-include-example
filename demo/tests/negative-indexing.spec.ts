import path from "node:path";
import { expect, test } from "@playwright/test";

const filePath = `file://${path.join(
	process.cwd(),
	"docs/classes/Publisher.html",
)}`;

test("Should inject a title named 'Example'", async ({ page }) => {
	await page.goto(filePath);
	const title = page.getByRole("heading", { level: 3, name: "Example" });
	await expect(title).toBeVisible();
});

test("Should handle negative indexing syntax to include last 5 lines", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should include the final publishing steps (last 5 lines)
	await expect(code).toContainText("Final publishing steps");
	await expect(code).toContainText("Finalizing publication process");
	await expect(code).toContainText("Publication complete");
});

test("Should exclude earlier lines when using negative indexing", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should not include the initial setup lines
	await expect(code).not.toContainText("Initialize publisher");
	await expect(code).not.toContainText("Add books to catalog");
});
