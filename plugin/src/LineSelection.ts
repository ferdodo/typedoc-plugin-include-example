export type LineSelection =
	| { type: "single"; isExclusion: boolean; line: number }
	| { type: "range"; isExclusion: boolean; start?: number; end?: number };
