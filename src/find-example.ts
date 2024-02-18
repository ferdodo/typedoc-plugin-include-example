import { existsSync, readFileSync } from "fs";
import { Comment } from "typedoc";
import { IncludeExampleTag } from "./include-example-tag";
import { parseIncludeExampleTag } from "./parse-include-example-tag";
import { applyLineSelection } from "./apply-line-selection";

export function findExample(comment: Comment): string | null {
	// Check for the @includeExample tag and get its associated file path
	const commentTag = comment.blockTags.find((tag: { tag: string }) => tag.tag === "@includeExample");

	if (!commentTag) {
		return null;
	}

	const includeExampleTag: IncludeExampleTag = parseIncludeExampleTag(commentTag.content[0].text);

	// Ensure file exists
	if (!existsSync(includeExampleTag.path)) {
		throw new Error(`File not found for ${includeExampleTag.path}`);
	}

	const fileContent = readFileSync(includeExampleTag.path, "utf-8");
	return applyLineSelection(fileContent, includeExampleTag);
}
