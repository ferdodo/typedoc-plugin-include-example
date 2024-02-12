import { test, expect } from "../example/add.fixture";

test("should inject a title named 'Example'", async function({ page }) {
	await expect(
		page.getByRole('heading', { level: 3 })
			.getByRole('link', { name: 'Example' })
	).toBeVisible();
});

test("should inject the example code source", async function({ page }) {
	await expect(
		page.getByRole('code')
	).toContainText("This code is written in the file add.example.ts");
});
