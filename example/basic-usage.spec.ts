import { test, expect } from "./basic-usage.fixture";

test("Should inject a title named 'Example'", async function({ page }) {
	await expect(
		page.getByRole("heading", { level: 3 })
			.getByRole("link", { name: "Example" })
	).toBeVisible();
});

test("Should inject the example code source", async function({ page }) {
	await expect(
		page.getByRole("code")
	).toContainText("This code is written in the file basic-usage.example.ts");
});
