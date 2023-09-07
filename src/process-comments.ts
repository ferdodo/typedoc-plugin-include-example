import { Context } from 'typedoc';
import { iterateProjectComments } from "./iterate-project-comments";
import { findExample } from "./find-example"
import { includeExample } from "./include-example";

export function processComments(context: Context) {
	for (const comment of iterateProjectComments(context)) {
        const example = findExample(comment);

		if (example !== null) {
			includeExample(comment, example);
		}
	}    	
}
