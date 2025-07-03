import type { ParsedLineSelector } from "./ParsedLineSelector.js";

export interface IncludeExampleTag {
	path: string;
	parsedSelector?: ParsedLineSelector;
}
