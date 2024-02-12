import { includeSpecificLine } from "./include-specific-line.demo";

// this previous line should not be in the docs
const answer = includeSpecificLine(); // only this line shall be included in the docs
// this next line should not be in the docs
console.log(answer); // 42
