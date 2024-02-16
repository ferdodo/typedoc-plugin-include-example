import { test, expect } from "./multiple-line-includes.fixture";

test("Should inject a title named 'Example'", async function({ page }) {
	await expect(
		page.getByRole("heading", { level: 3 })
			.getByRole("link", { name: "Example" })
	).toBeVisible();
});

test("Should inject the line 4", async function({ page }) {
	await expect(
		page.getByRole("code")
	).toContainText("// this line range");
});

test("Should inject the line 5", async function({ page }) {
	await expect(
		page.getByRole("code")
	).toContainText("// shall be included");
});

test("Should inject the line 6", async function({ page }) {
	await expect(
		page.getByRole("code")
	).toContainText("// in the example");
});

test("Previous line to the line range should not be included", async function({ page }) {
	await expect(
		page.getByRole("code")
	).not.toContainText("// this previous line should not be in the docs");
});

test("Next line to the specific line range shall not be in the doc", async function({ page }) {
	await expect(
		page.getByRole("code")
	).not.toContainText("// this next line should not be in the docs");
});

test("Previous line to the line 10 should not be included", async function({ page }) {
	await expect(
		page.getByRole("code")
	).not.toContainText("// line before 10 is not included");
});

test("The line 10 should be included", async function({ page }) {
	await expect(
		page.getByRole("code")
	).toContainText("console.log(answer); // 42");
});

test("Next line to the line 10 should not be included", async function({ page }) {
	await expect(
		page.getByRole("code")
	).not.toContainText("// line after 10 is not included");
});

test("Previous line to the line 13 should not be included", async function({ page }) {
	await expect(
		page.getByRole("code")
	).not.toContainText("// line before 13 is not included");
});

test("The line 13 should be included", async function({ page }) {
	await expect(
		page.getByRole("code")
	).toContainText("// this line is also included");
});

test("Next line to the line 13 should not be included", async function({ page }) {
	await expect(
		page.getByRole("code")
	).not.toContainText("// line after 13 is not included");
});
