import { multipleLineIncludes } from "./multiple-line-includes.demo";

// this previous line should not be in the docs
const answer = multipleLineIncludes() // this line range
	.toFixed() // shall be included
	.repeat(3); // in the example
// this next line should not be in the docs

// line before 10 is not included
console.log(answer); // 42
// line after 10 is not included
// line before 13 is not included
// this line is also included
// line after 13 is not included
