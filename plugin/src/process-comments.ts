import type { Context } from "typedoc";
import { findExample } from "./find-example.js";
import { includeExample } from "./include-example.js";
import { iterateProjectComments } from "./iterate-project-comments.js";

export function processComments(context: Context) {
	for (const comment of iterateProjectComments(context)) {
		const example = findExample(comment);

		if (example !== null) {
			includeExample(comment, example);
		}
	}
}
