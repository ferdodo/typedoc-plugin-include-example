import type { Book } from "./Book";

/**
 * A class representing a literary magazine with article processing.
 *
 * @example Article header processing (first 11 lines)
 * @includeExample ./src/Magazine.example.ts[:11]
 */
export class Magazine {
	title: string;
	articles: string[] = [];
	featuredBooks: Book[] = [];
	issueNumber: number;

	constructor(title: string, issueNumber: number) {
		this.title = title;
		this.issueNumber = issueNumber;
	}

	addArticle(article: string): Magazine {
		this.articles.push(article);
		return this;
	}

	featureBook(book: Book): Magazine {
		this.featuredBooks.push(book);
		return this;
	}

	getIssueInfo(): string {
		return `${this.title} - Issue #${this.issueNumber}`;
	}
}
