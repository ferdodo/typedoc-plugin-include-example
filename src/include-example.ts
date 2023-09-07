import { Comment } from 'typedoc';

export function includeExample(comment: Comment, example: string): void {
	comment.summary.push({
		kind: 'code',
		text: `\n\n### Example\n\`\`\`\n\n${example}\n\`\`\``
	});

	comment.blockTags = comment.blockTags.filter(tag => tag.tag !== "@includeExample");
}
