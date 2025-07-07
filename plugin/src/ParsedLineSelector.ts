import type { LineSelection } from "./LineSelection.js";

export type ParsedLineSelector = {
	selections: LineSelection[];
	hasNegativeIndexing: boolean;
	hasExclusions: boolean;
};
