import { test, expect } from "./basic-usage.fixture";

test("Should inject a title named 'Example'", async function({ page }) {
	await expect(
		page.getByRole("heading", { level: 3, name: "Example" })
	).toBeVisible();
});

test("Should inject the example code source", async function({ page }) {
	await expect(
		page.getByRole("code")
	).toContainText("const answer = basicUsage();");
});
