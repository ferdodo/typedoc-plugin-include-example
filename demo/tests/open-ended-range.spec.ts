import path from "node:path";
import { expect, test } from "@playwright/test";

const filePath = `file://${path.join(
	process.cwd(),
	"docs/classes/Magazine.html",
)}`;

test("Should inject a title named 'Example'", async ({ page }) => {
	await page.goto(filePath);
	const title = page.getByRole("heading", { level: 3, name: "Example" });
	await expect(title).toBeVisible();
});

test("Should handle open-ended range syntax to include first 11 lines", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should include the header processing section (first 11 lines)
	await expect(code).toContainText("Magazine header setup");
	await expect(code).toContainText("Literary Quarterly");
	await expect(code).toContainText("End of header processing section");
});

test("Should exclude lines after the open-ended range", async ({ page }) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should not include content processing section that comes after line 11
	await expect(code).not.toContainText(
		"Content processing section starts here",
	);
	await expect(code).not.toContainText("Add articles to magazine");
});
