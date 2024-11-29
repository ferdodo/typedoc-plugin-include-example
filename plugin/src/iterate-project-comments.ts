import type { Comment, Context, Reflection } from "typedoc";

export function* iterateProjectComments(context: Context): Iterable<Comment> {
	for (const key in context.project.reflections) {
		const reflection: Reflection = context.project.reflections[key];
		const comment: Comment | undefined = reflection.comment;

		if (comment) {
			yield comment;
		}
	}
}
