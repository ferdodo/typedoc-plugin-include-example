import type { Book } from "./Book";

/**
 * A class representing a library.
 *
 * @includeExample ./src/Library.example.ts[5:9]
 */
export class Library {
	books: Book[] = [];

	addBook(book: Book): Library {
		this.books.push(book);
		return this;
	}

	listBooks() {
		return this.books.map((book) => book.title).join(", ");
	}
}
