import type { ParsedLineSelector } from "./ParsedLineSelector.js";

export interface IncludeExampleTag {
	path: string;
	lines?: number[];
	parsedSelector?: ParsedLineSelector;
}
