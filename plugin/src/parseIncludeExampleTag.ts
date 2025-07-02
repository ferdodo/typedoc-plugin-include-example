import type { IncludeExampleTag } from "./IncludeExampleTag.js";
import { parseLineSelector } from "./parseLineSelector.js";

export function parseIncludeExampleTag(
  tag: string,
  filePath?: string
): IncludeExampleTag {
  // Check for new bracket syntax: path/to/file[selector]
  const bracketMatch = tag.match(/^(.+?)\[(.+)\]$/);

  if (bracketMatch) {
    // New bracket syntax
    const [, path, selectorString] = bracketMatch;
    const includeExampleTag: IncludeExampleTag = { path };

    // Parse the selector string (will be enhanced in next task)
    includeExampleTag.lines = selectorString
      .split(",")
      .flatMap(parseLineSelector);

    return includeExampleTag;
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
        `BREAKING CHANGE: The colon syntax '${tag}' is no longer supported. Please migrate to the new bracket syntax: '${potentialPath}[${potentialSelector}]'. See documentation for the new Python-like slicing syntax.`
      );
    }
  }

  // No selector syntax - use entire file
  const path: string | undefined = tag || filePath;

  if (!path) {
    throw new Error("Path not found !");
  }

  return { path };
}
