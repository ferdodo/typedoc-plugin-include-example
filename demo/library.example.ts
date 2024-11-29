import { Book } from "./book";
import { Library } from "./library";

// this previous line should not be in the docs
const library = new Library() // this line range
	.addBook(new Book("The Lord of the Rings")) // shall be included
	.addBook(new Book("The Hobbit")); // in the example

console.log(library.listBooks());
// this next line should not be in the docs
