import type { IncludeExampleTag } from "./include-example-tag.js";

export function applyLineSelection(
	content: string,
	includeExampleTag: IncludeExampleTag,
): string {
	const lines = content.split("\n");

	if (includeExampleTag.lines === undefined) {
		return content;
	}

	return includeExampleTag.lines
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
