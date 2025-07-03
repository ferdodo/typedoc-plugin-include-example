import { Book } from "./Book";
import { Publisher } from "./Publisher";

// Initialize publisher
const publisher = new Publisher("Penguin Random House", 1927);

// Add books to catalog
const book1 = new Book("The Great Gatsby");
const book2 = new Book("To Kill a Mockingbird");
publisher.publishBook(book1);
publisher.publishBook(book2);

// Validate catalog
const totalBooks = publisher.getPublishedCount();
console.log(`Catalog validated: ${totalBooks} books ready`);

// Final publishing steps (these lines demonstrate negative indexing)
console.log("Finalizing publication process...");
console.log("Updating distribution channels...");
console.log(`${publisher.getInfo()} - Publication complete!`);
