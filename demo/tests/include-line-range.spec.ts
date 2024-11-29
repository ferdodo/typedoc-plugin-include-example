import path from "node:path";
import { expect, test } from "@playwright/test";

const filePath = `file://${path.join(process.cwd(), "docs/classes/Library.html")}`;

test("Should inject a title named 'Example'", async ({ page }) => {
	await page.goto(filePath);
	const title = page.getByRole("heading", { level: 3, name: "Example" });
	await expect(title).toBeVisible();
});

test("Should inject the line 4", async ({ page }) => {
	await page.goto(filePath);
	const code = page.getByRole("code");
	await expect(code).toContainText("// this line range");
});

test("Should inject the line 5", async ({ page }) => {
	await page.goto(filePath);
	const code = page.getByRole("code");
	await expect(code).toContainText("// shall be included");
});

test("Should inject the line 6", async ({ page }) => {
	await page.goto(filePath);
	const code = page.getByRole("code");
	await expect(code).toContainText("// in the example");
});

test("Previous line to the line range should not be included", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code");

	await expect(code).not.toContainText(
		"// this previous line should not be in the docs",
	);
});

test("Next line to the specific line range shall not be in the doc", async ({
	page,
}) => {
	await page.goto(filePath);
	const code = page.getByRole("code");

	await expect(code).not.toContainText(
		"// this next line should not be in the docs",
	);
});
