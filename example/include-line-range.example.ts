import { includeSpecificLine } from "./include-specific-line.demo";

// this previous line should not be in the docs
const answer = includeSpecificLine() // this line range
	.toFixed()                       // shall be included
	.repeat(3);                      // in the example
// this next line should not be in the docs
console.log(answer); // 42
