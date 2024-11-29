import type { Chapter } from "./chapter";

/**
 * Class representing a book.
 *
 * @includeExample ./book.example.ts
 */
export class Book {
	title: string;
	chapters: Chapter[] = [];

	constructor(title: string, chapters: Chapter[] = []) {
		this.title = title;
		this.chapters = chapters;
	}

	translateTitle() {
		return trollFrenchify(this.title);
	}
}

function trollFrenchify(text: string): string {
	const replacements: [RegExp, string][] = [
		[/\bthe\b/gi, "le"],
		[/\ba\b/gi, "un"],
		[/\bis\b/gi, "est"],
		[/\bof\b/gi, "de"],
		[/\bin\b/gi, "dans"],
		[/\bto\b/gi, "à"],
		[/\band\b/gi, "et"],
		[/\bfor\b/gi, "pour"],
		[/\bwith\b/gi, "avec"],
		[/\byou\b/gi, "tu"],
		[/\bI\b/gi, "je"],
		[/\bwe\b/gi, "nous"],
		[/\bthey\b/gi, "ils"],
		[/\bhe\b/gi, "il"],
		[/\bshe\b/gi, "elle"],
		[/\bthis\b/gi, "ce"],
		[/\bthat\b/gi, "ça"],
		[/\bhere\b/gi, "ici"],
		[/\bthere\b/gi, "là"],
		[/\bwhat\b/gi, "quoi"],
		[/\bwhy\b/gi, "pourquoi"],
		[/\bhow\b/gi, "comment"],
		[/\bwhen\b/gi, "quand"],
		[/\bwhere\b/gi, "où"],
		[/\bwho\b/gi, "qui"],
		[/\byes\b/gi, "oui"],
		[/\bno\b/gi, "non"],
		[/\bgood\b/gi, "bon"],
		[/\bbad\b/gi, "mauvais"],
		[/\bbig\b/gi, "grand"],
		[/\bsmall\b/gi, "petit"],
		[/ing\b/gi, "ant"],
		[/\b(\w+)c\b/gi, "$1que"],
		[/\bgreat\b/gi, "grand"],
	];

	return replacements.reduce(
		(acc, [pattern, replacement]) => acc.replace(pattern, replacement),
		text,
	);
}
