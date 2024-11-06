import { Book } from "./book";

const book = new Book("The Lord of the Rings");
const frenchTitle = book.translateTitle();
console.log(frenchTitle); // "le Lord de le Rings"
