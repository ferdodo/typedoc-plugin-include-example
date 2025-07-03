import path from "node:path";
import { expect, test } from "@playwright/test";

const filePath = `file://${path.join(
	process.cwd(),
	"docs/classes/BookStore.html",
)}`;

test("Should inject a title named 'Example'", async ({ page }) => {
	await page.goto(filePath);
	const title = page.getByRole("heading", { level: 3, name: "Example" });
	await expect(title).toBeVisible();
});

test("Should handle exclusion syntax to exclude sensitive lines", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should include the setup and inventory management
	await expect(code).toContainText("Initialize bookstore");
	await expect(code).toContainText("Add inventory");
});

test("Should exclude lines marked as sensitive pricing logic", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should not include the sensitive pricing logic (lines 10-15)
	await expect(code).not.toContainText("SENSITIVE: Pricing logic");
	await expect(code).not.toContainText("basePrice");
	await expect(code).not.toContainText("markup");
	await expect(code).not.toContainText("finalPrice");
});

test("Should include lines after the excluded range", async ({ page }) => {
	await page.goto(filePath);
	const code = page.getByRole("code").first();

	// Should include the inventory operations that come after the excluded section
	await expect(code).toContainText("addToInventory");
});
