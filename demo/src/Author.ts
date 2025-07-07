import type { Book } from "./Book";

/**
 * A class representing an author.
 *
 * @includeExample ./src/Author.example.ts[7]
 */
export class Author {
	books: Book[] = [];

	addBook(book: Book): Author {
		this.books.push(book);
		return this;
	}
}
