import { Book } from "./Book";
import { Magazine } from "./Magazine";

// Magazine header setup
const magazine = new Magazine("Literary Quarterly", 42);
console.log(`Creating ${magazine.getIssueInfo()}`);

// Initialize featured books
const book1 = new Book("Beloved");
const book2 = new Book("One Hundred Years of Solitude");
// End of header processing section

// Content processing section starts here
magazine.featureBook(book1);
magazine.featureBook(book2);

// Add articles to magazine
magazine.addArticle("The Evolution of Modern Literature");
magazine.addArticle("Magical Realism in Contemporary Fiction");
magazine.addArticle("Interview with Emerging Authors");

// Finalize magazine content
console.log(`Featured books: ${magazine.featuredBooks.length}`);
console.log(`Total articles: ${magazine.articles.length}`);
console.log(`${magazine.getIssueInfo()} ready for publication`);
