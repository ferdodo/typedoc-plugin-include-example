import { Book } from "./Book";
import { BookStore } from "./BookStore";

// Initialize bookstore
const bookstore = new BookStore("The Corner Bookshop", "Downtown");

// Add inventory
const book1 = new Book("1984");
const book2 = new Book("Pride and Prejudice");
// SENSITIVE: Pricing logic - should be excluded from docs
const basePrice = 15.99;
const markup = 0.25;
const finalPrice = basePrice * (1 + markup);
console.log(`Internal pricing: $${finalPrice}`);
// END SENSITIVE SECTION

bookstore.addToInventory(book1);
bookstore.addToInventory(book2);

// Check stock
console.log(`Books in stock: ${bookstore.getInventoryCount()}`);
console.log(`Has '1984': ${bookstore.hasBook("1984")}`);
console.log(`Store: ${bookstore.name} at ${bookstore.location}`);
