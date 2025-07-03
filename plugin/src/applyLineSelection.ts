import type { IncludeExampleTag } from "./IncludeExampleTag.js";
import { resolveLineSelections } from "./resolveLineSelections.js";

export function applyLineSelection(
	content: string,
	includeExampleTag: IncludeExampleTag,
): string {
	const lines = content.split("\n");

	// Handle parsed selector syntax
	if (includeExampleTag.parsedSelector) {
		const resolvedLines = resolveLineSelections(
			includeExampleTag.parsedSelector,
			lines.length,
		);

		return resolvedLines
			.map((lineNumber: number) => {
				const line = lines[lineNumber - 1];

				if (line === undefined) {
					throw new Error(
						`Line number ${lineNumber} is out of range for file ${includeExampleTag.path}`,
					);
				}

				return line;
			})
			.join("\n");
	}

	// No selector - use entire file
	return content;
}
