import { Book } from "./Book";
import { Review } from "./Review";

// Setup review data
const book = new Book("The Catcher in the Rye");
// VALIDATION: Input sanitization - should be excluded
const sanitizedComment = "A profound coming-of-age story";
const validatedRating = Math.min(Math.max(5, 1), 5);
console.log(`Validation: Rating ${validatedRating} approved`);
// END VALIDATION SECTION

// Create review instance
const review = new Review(book, 5, sanitizedComment, "Literary Critic");

// Process review
console.log("Processing review...");
const isValidReview = review.isValid();

// Summary and output
console.log("Review processing complete");
console.log(`Valid review: ${isValidReview}`);
console.log(`Formatted: ${review.getFormattedReview()}`);
console.log(`Book: ${review.book.title}`);
console.log("Review ready for publication");
