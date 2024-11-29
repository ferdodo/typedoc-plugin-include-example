import { existsSync, readFileSync } from "node:fs";
import type { Comment } from "typedoc";
import { applyLineSelection } from "./apply-line-selection.js";
import type { IncludeExampleTag } from "./include-example-tag.js";
import { parseIncludeExampleTag } from "./parse-include-example-tag.js";

export function findExample(comment: Comment): string | null {
	const commentTag = comment.blockTags.find(
		(tag: { tag: string }) => tag.tag === "@includeExample",
	);

	if (!commentTag) {
		return null;
	}

	const includeExampleTag: IncludeExampleTag = parseIncludeExampleTag(
		commentTag.content[0].text,
	);

	if (!existsSync(includeExampleTag.path)) {
		throw new Error(`File not found for ${includeExampleTag.path}`);
	}

	const fileContent = readFileSync(includeExampleTag.path, "utf-8");
	return applyLineSelection(fileContent, includeExampleTag);
}