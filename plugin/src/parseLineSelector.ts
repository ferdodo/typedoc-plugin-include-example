import type { LineSelection } from "./LineSelection.js";

export function parseLineSelector(lineSelectorString: string): LineSelection[] {
	// Handle empty or whitespace-only selectors
	const trimmed = lineSelectorString.trim();
	if (!trimmed || trimmed === ":") {
		return [];
	}

	// v3.0.0: Only support new bracket syntax with colons
	// Old dash syntax is no longer supported
	if (hasOldDashSyntax(trimmed)) {
		throw new Error(
			`BREAKING CHANGE: The dash syntax '${trimmed}' inside brackets is no longer supported in v3.0.0+. Please use colon syntax instead. Examples: '2-4' → '2:4', '5-7,11' → '5:7,11'. See documentation for the new bracket syntax.`,
		);
	}

	return parseSelections(trimmed);
}

function hasOldDashSyntax(selector: string): boolean {
	return selector
		.split(",")
		.map((part) => part.trim())
		.some((part) => {
			// Skip exclusions for this check
			const cleanPart = part.startsWith("!") ? part.slice(1) : part;

			// If it contains a colon, it's new syntax
			if (cleanPart.includes(":")) return false;

			// Check for dash patterns that are NOT single negative numbers
			if (cleanPart.includes("-")) {
				// Single negative number is valid: -5
				if (/^-\d+$/.test(cleanPart)) return false;
				// Dash range like "2-4" is old syntax
				return true;
			}

			return false;
		});
}

function parseSelections(selector: string): LineSelection[] {
	const selections: LineSelection[] = [];
	const parts = selector.split(",").map((part) => part.trim());

	for (const part of parts) {
		if (!part) continue;
		const isExclusion = part.startsWith("!");
		const cleanPart = isExclusion ? part.slice(1) : part;
		const selection = parseSelection(cleanPart, isExclusion);
		selections.push(selection);
	}

	return selections;
}

function parseLineNumber(value: string, context: string): number {
	const num = Number.parseInt(value);
	if (!Number.isFinite(num)) {
		throw new Error(`Invalid ${context}: ${value}`);
	}
	if (num === 0) {
		throw new Error(`${context} must be positive or negative, not zero`);
	}
	return num;
}

function parseSelection(part: string, isExclusion: boolean): LineSelection {
	// Handle single line (positive or negative)
	if (!part.includes(":")) {
		const num = parseLineNumber(part, "line number");
		return {
			type: "single",
			isExclusion,
			line: num,
		};
	}

	// Handle range syntax (start:end, start:, :end, :)
	const colonIndex = part.indexOf(":");
	const startStr = part.slice(0, colonIndex);
	const endStr = part.slice(colonIndex + 1);

	let start: number | undefined;
	let end: number | undefined;

	// Parse start
	if (startStr) {
		start = parseLineNumber(startStr, "range start");
	}

	// Parse end
	if (endStr) {
		end = parseLineNumber(endStr, "range end");
	}

	return {
		type: "range",
		isExclusion,
		start,
		end,
	};
}
