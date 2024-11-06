import { test, expect } from "@playwright/test";
import path from "path";

const filePath = "file://" + path.join(process.cwd(), "docs/classes/Library.html");

test("Should inject a title named 'Example'", async function({ page }) {
	await page.goto(filePath);
	const title = page.getByRole("heading", { level: 3, name: "Example" });
	await expect(title).toBeVisible();
});

test("Should inject the line 4", async function({ page }) {
	await page.goto(filePath);
	const code = page.getByRole("code");
	await expect(code).toContainText("// this line range");
});

test("Should inject the line 5", async function({ page }) {
	await page.goto(filePath);
	const code = page.getByRole("code");
	await expect(code).toContainText("// shall be included");
});

test("Should inject the line 6", async function({ page }) {
	await page.goto(filePath);
	const code = page.getByRole("code");
	await expect(code).toContainText("// in the example");
});

test("Previous line to the line range should not be included", async function({ page }) {
	await page.goto(filePath);
	const code = page.getByRole("code");
	await expect(code).not.toContainText("// this previous line should not be in the docs");
});

test("Next line to the specific line range shall not be in the doc", async function({ page }) {
	await page.goto(filePath);
	const code = page.getByRole("code");
	await expect(code).not.toContainText("// this next line should not be in the docs");
});
