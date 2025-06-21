import type { Context } from "typedoc";
import { findExample } from "./findExample.js";
import { includeExample } from "./includeExample.js";
import { iterateProjectComments } from "./iterateProjectComments.js";

export function processComments(context: Context) {
	for (const comment of iterateProjectComments(context)) {
		const example = findExample(comment);

		if (example !== null) {
			includeExample(comment, example);
		}
	}
}
