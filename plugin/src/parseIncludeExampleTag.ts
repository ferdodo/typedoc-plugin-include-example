import type { IncludeExampleTag } from "./IncludeExampleTag.js";
import { parseLineSelector } from "./parseLineSelector.js";

export function parseIncludeExampleTag(
	tag: string,
	filePath?: string,
): IncludeExampleTag {
	const splittedTag = tag.split(":")[Symbol.iterator]();
	const path: string | undefined = splittedTag.next().value || filePath;

	if (!path) {
		throw new Error("Path not found !");
	}

	const includeExampleTag: IncludeExampleTag = { path };
	const lineNumbersString: string | undefined = splittedTag.next().value;

	if (lineNumbersString === undefined) {
		return includeExampleTag;
	}

	includeExampleTag.lines = lineNumbersString
		.split(",")
		.flatMap(parseLineSelector);

	return includeExampleTag;
}
