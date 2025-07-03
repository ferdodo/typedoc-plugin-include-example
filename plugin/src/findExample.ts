import { existsSync, readFileSync } from "node:fs";
import { join, parse } from "node:path";
import type { Comment } from "typedoc";
import type { IncludeExampleTag } from "./IncludeExampleTag.js";
import { applyLineSelection } from "./applyLineSelection.js";
import { parseIncludeExampleTag } from "./parseIncludeExampleTag.js";

export function findExample(comment: Comment): string | null {
	const commentTag = comment.blockTags.find(
		(tag: { tag: string }) => tag.tag === "@includeExample",
	);

	if (!commentTag) {
		return null;
	}

	const { dir, name, ext } = parse(comment.sourcePath || "");
	const exampleFileName = `${name}.example${ext}`;
	const exampleFilePath = join(dir, exampleFileName);

	const includeExampleTag: IncludeExampleTag = parseIncludeExampleTag(
		commentTag.content[0]?.text || "",
		exampleFilePath,
	);

	if (!existsSync(includeExampleTag.path)) {
		// Try resolving relative to source file directory
		const relativePath = join(dir, includeExampleTag.path);
		if (existsSync(relativePath)) {
			includeExampleTag.path = relativePath;
		}
	}

	if (!existsSync(includeExampleTag.path)) {
		throw new Error(`File not found for ${includeExampleTag.path}`);
	}

	const fileContent = readFileSync(includeExampleTag.path, "utf-8");
	return applyLineSelection(fileContent, includeExampleTag);
}
