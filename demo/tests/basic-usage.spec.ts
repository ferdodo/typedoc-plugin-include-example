import { test, expect } from "@playwright/test";
import path from "path";

test("Should inject a title named 'Example'", async function({ page }) {
	const filePath = path.join(process.cwd(), "docs/classes/Book.html");
	await page.goto(`file://${filePath}`);
	const title = page.getByRole("heading", { level: 3, name: "Example" });
	await expect(title).toBeVisible();
});

test("Should inject the example code source", async function({ page }) {
	const filePath = path.join(process.cwd(), "docs/classes/Book.html");
	await page.goto(`file://${filePath}`);
	const code = page.getByRole("code");
	await expect(code).toContainText('const book = new Book("The Lord of the Rings");');
	await expect(code).toContainText("const frenchTitle = book.translateTitle();");
	await expect(code).toContainText('console.log(frenchTitle); // "le Lord de le Rings"');
});
