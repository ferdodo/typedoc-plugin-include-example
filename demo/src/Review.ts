import type { Book } from "./Book";

/**
 * A class representing a book review with processing workflow.
 *
 * @example Review processing (setup + process, excluding validation)
 * @includeExample ./src/Review.example.ts[1:17,!6:10]
 */
export class Review {
	book: Book;
	rating: number;
	comment: string;
	reviewerName: string;

	constructor(
		book: Book,
		rating: number,
		comment: string,
		reviewerName: string,
	) {
		this.book = book;
		this.rating = rating;
		this.comment = comment;
		this.reviewerName = reviewerName;
	}

	isValid(): boolean {
		return this.rating >= 1 && this.rating <= 5 && this.comment.length > 0;
	}

	getFormattedReview(): string {
		return `"${this.comment}" - ${this.reviewerName} (${this.rating}/5 stars)`;
	}
}
