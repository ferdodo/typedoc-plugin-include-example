import { Author } from "./Author";
import { Book } from "./Book";

const author = new Author();

// this previous line should not be in the docs
author.addBook(new Book("The Lord of the Rings")); // only this line shall be included in the docs
// this next line should not be in the docs
