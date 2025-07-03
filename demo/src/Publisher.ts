import type { Book } from "./Book";

/**
 * A class representing a book publisher.
 *
 * @example Publishing workflow (last 5 steps)
 * @includeExample ./src/Publisher.example.ts[-5:]
 */
export class Publisher {
	name: string;
	books: Book[] = [];
	establishedYear: number;

	constructor(name: string, establishedYear: number) {
		this.name = name;
		this.establishedYear = establishedYear;
	}

	publishBook(book: Book): Publisher {
		this.books.push(book);
		return this;
	}

	getPublishedCount(): number {
		return this.books.length;
	}

	getInfo(): string {
		return `${this.name} (Est. ${
			this.establishedYear
		}) - ${this.getPublishedCount()} books published`;
	}
}
