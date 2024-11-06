import type { Book } from "./book";

/**
 * A class representing an author.
 *
 * @includeExample ./demo/author.example.ts:7
 */
export class Author {
	books: Book[] = [];

	addBook(book: Book): Author {
		this.books.push(book);
		return this;
	}
}
