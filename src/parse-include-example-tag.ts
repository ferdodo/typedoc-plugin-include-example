import { IncludeExampleTag } from "./include-example-tag";
import { parseLineSelector } from "./parse-line-selector";

export function parseIncludeExampleTag(tag: string): IncludeExampleTag {
	const splittedTag = tag.split(":")
		[Symbol.iterator]();

	const path: string | undefined = splittedTag.next().value;

	if (path === undefined) {
		throw new Error("Path not found !");
	}

	const includeExampleTag: IncludeExampleTag = { path };
	const lineNumbersString: string | undefined = splittedTag.next().value;

	if (lineNumbersString === undefined) {
		return includeExampleTag;
	}

	includeExampleTag.lines = lineNumbersString.split(",")
		.flatMap(parseLineSelector);

	return includeExampleTag;
}
