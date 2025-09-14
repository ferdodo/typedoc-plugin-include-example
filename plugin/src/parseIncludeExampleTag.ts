import type { IncludeExampleTag } from "./IncludeExampleTag.js";
import { checkLegacySyntax } from "./checkLegacySyntax.js";
import { parseLineSelector } from "./parseLineSelector.js";
import { parseSelectorString } from "./parseSelectorString.js";
import { parseSpecificPath } from "./parseSpecificPath.js";

export function parseIncludeExampleTag(
	tag: string,
	defaultFilePath?: string,
): IncludeExampleTag {
	const path = parseSpecificPath(tag);
	const selectorString = parseSelectorString(tag);

	if (path && selectorString) {
		const parsedSelector = parseLineSelector(selectorString);
		return { path, parsedSelector };
	}

	// If tag contains brackets but doesn't match valid bracket syntax, it's malformed
	if (tag.includes("[") || tag.includes("]")) {
		throw new Error("Malformed bracket syntax");
	}

	checkLegacySyntax(tag);
	return { path: (tag || defaultFilePath) ?? "" };
}
