import path from "node:path";
import { expect, test } from "@playwright/test";

const filePath = `file://${path.join(process.cwd(), "docs/classes/Author.html")}`;

test("Should inject a title named 'Example'", async ({ page }) => {
	await page.goto(filePath);
	const title = page.getByRole("heading", { level: 3, name: "Example" });
	await expect(title).toBeVisible();
});

test("Should inject the specific line", async ({ page }) => {
	await page.goto(filePath);
	const code = page.getByRole("code");

	await expect(code).toContainText(
		"only this line shall be included in the docs",
	);
});

test("Previous line to the specific line shall not be in the doc", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code");

	await expect(code).not.toContainText(
		"this previous line should not be in the docs",
	);
});

test("Next line to the specific line shall not be in the doc", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code");

	await expect(code).not.toContainText(
		"this next line should not be in the docs",
	);
});
