import type { IncludeExampleTag } from "./IncludeExampleTag.js";
import { parseLineSelector } from "./parseLineSelector.js";

export function parseIncludeExampleTag(
	tag: string,
	filePath?: string,
): IncludeExampleTag {
	// Handle empty tag
	if (!tag && !filePath) {
		return { path: "" };
	}

	// Check for new bracket syntax: path/to/file[selector] or path/to/file[]
	const bracketMatch = tag.match(/^(.+?)\[(.*)?\]$/);

	if (bracketMatch) {
		// New bracket syntax
		const [, path, selectorString] = bracketMatch;

		// Check for empty brackets
		if (selectorString === "" || selectorString === undefined) {
			throw new Error("Empty bracket syntax");
		}

		const includeExampleTag: IncludeExampleTag = { path };

		// Parse the selector string using new bracket syntax
		const parsed = parseLineSelector(selectorString);

		// Store the parsed selector for later resolution
		includeExampleTag.parsedSelector = parsed;

		return includeExampleTag;
	}

	// If tag contains brackets but doesn't match valid bracket syntax, it's malformed
	if (tag.includes("[") || tag.includes("]")) {
		throw new Error("Malformed bracket syntax");
	}

	// Check for old colon syntax: path/to/file:selector
	// Only treat as selector if it looks like line numbers/ranges
	const colonIndex = tag.lastIndexOf(":");
	if (colonIndex !== -1) {
		const potentialPath = tag.substring(0, colonIndex);
		const potentialSelector = tag.substring(colonIndex + 1);

		// Check if the part after colon looks like a line selector
		if (potentialSelector.trim() && /^[\d\-,\s]+$/.test(potentialSelector)) {
			// This looks like old colon syntax with line selectors
			throw new Error(
				`BREAKING CHANGE: The colon syntax '${tag}' is no longer supported in v3.0.0+. Please migrate to the new bracket syntax: '${potentialPath}[${potentialSelector.replace(
					/-/g,
					":",
				)}]'. See documentation for the new bracket syntax.`,
			);
		}
	}

	// No selector syntax - use entire file
	const path: string | undefined = tag || filePath;

	if (!path) {
		return { path: "" };
	}

	return { path };
}
