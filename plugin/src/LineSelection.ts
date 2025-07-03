export interface LineSelection {
	type: "inclusion" | "exclusion";
	start?: number;
	end?: number;
	single?: number;
	isNegative?: boolean;
}
