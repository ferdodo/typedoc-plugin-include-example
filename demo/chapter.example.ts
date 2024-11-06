import { Book } from "./book";
import { Chapter } from "./chapter";

// this previous line should not be in the docs
const chapter1 = new Chapter(); // this line range
const chapter2 = new Chapter(); // shall be included
const chapter3 = new Chapter(); // in the example
// this next line should not be in the docs

// line 10 is not included
const book = new Book("The Lord of the Rings", [chapter1, chapter2, chapter3]);
// line 12 is not included
console.log(book.chapters.length); // 3
// line 14 is not included
