import { existsSync, readFileSync } from "fs";
import { Comment } from "typedoc";
import { IncludeExampleTag } from "./include-example-tag";
import { parseIncludeExampleTag } from "./parse-include-example-tag";
import { applyLineSelection } from "./apply-line-selection";

export function findExample(comment: Comment): string | null {
	const commentTag = comment.blockTags.find((tag: { tag: string }) => tag.tag === "@includeExample");

	if (!commentTag) {
		return null;
	}

	const includeExampleTag: IncludeExampleTag = parseIncludeExampleTag(commentTag.content[0].text);

	if (!existsSync(includeExampleTag.path)) {
		throw new Error(`File not found for ${includeExampleTag.path}`);
	}

	const fileContent = readFileSync(includeExampleTag.path, "utf-8");
	return applyLineSelection(fileContent, includeExampleTag);
}
