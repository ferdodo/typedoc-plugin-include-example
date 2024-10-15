import { test, expect } from "./include-specific-line.fixture";

test("Should inject a title named 'Example'", async function({ page }) {
	await expect(
		page.getByRole("heading", { level: 3, name: "Example" })
	).toBeVisible();
});

test("Should inject the specific line", async function({ page }) {
	await expect(
		page.getByRole("code")
	).toContainText("only this line shall be included in the docs");
});

test("Previous line to the specific line shall not be in the doc", async function({ page }) {
	await expect(
		page.getByRole("code")
	).not.toContainText("this previous line should not be in the docs");
});

test("Next line to the specific line shall not be in the doc", async function({ page }) {
	await expect(
		page.getByRole("code")
	).not.toContainText("this next line should not be in the docs");
});
