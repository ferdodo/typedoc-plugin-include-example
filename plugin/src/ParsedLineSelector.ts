import type { LineSelection } from "./LineSelection.js";

export interface ParsedLineSelector {
	selections: LineSelection[];
	hasNegativeIndexing: boolean;
	hasExclusions: boolean;
}
