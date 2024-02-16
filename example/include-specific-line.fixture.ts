import { test as base } from '@playwright/test';
import path from "path";

export const test = base.extend({
	page: async function({ page }, use) {
		const filePath = path.join(process.cwd(), "docs/functions/includeSpecificLine.html");
		await page.goto(`file://${ filePath }`);
		await use(page);
	}
});

export { expect } from '@playwright/test';
