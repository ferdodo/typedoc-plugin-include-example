import { existsSync, readFileSync } from 'fs';
import { Comment } from 'typedoc';

export function findExample(comment: Comment): string | null {
	// Check for the @includeExample tag and get its associated file path
	const includeExampleTag = comment.blockTags.find(tag => tag.tag === "@includeExample");
	if (!includeExampleTag) {
		return null;
	}

	const filePath = includeExampleTag.content[0].text;

	// Ensure file exists
	if (!existsSync(filePath)) {
	    throw new Error(`File not found for ${filePath}`);
	}

	return readFileSync(filePath, 'utf-8');
}
