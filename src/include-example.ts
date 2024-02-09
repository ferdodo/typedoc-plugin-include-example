import { Comment } from 'typedoc';

const test: string = 3;

export function includeExample(comment: Comment, example: string): void {
	comment.summary.push({
		kind: 'code',
		text: `\n\n### Example\n\`\`\`\n\n${example}\n\`\`\``
	});

	comment.blockTags = comment.blockTags.filter(tag => tag.tag !== "@includeExample");
}
