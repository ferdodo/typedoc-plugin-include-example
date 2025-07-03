import type { Book } from "./Book";

/**
 * A class representing a bookstore with inventory management.
 *
 * @example Inventory management (excluding pricing logic)
 * @includeExample ./src/BookStore.example.ts[!10:15]
 */
export class BookStore {
	name: string;
	inventory: Book[] = [];
	location: string;

	constructor(name: string, location: string) {
		this.name = name;
		this.location = location;
	}

	addToInventory(book: Book): BookStore {
		this.inventory.push(book);
		return this;
	}

	getInventoryCount(): number {
		return this.inventory.length;
	}

	hasBook(title: string): boolean {
		return this.inventory.some((book) => book.title === title);
	}
}
