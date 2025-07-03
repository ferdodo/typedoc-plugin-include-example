import type { LineSelection } from "./LineSelection.js";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";

export function parseLineSelector(
	lineSelectorString: string,
): ParsedLineSelector {
	// Handle empty or whitespace-only selectors
	const trimmed = lineSelectorString.trim();
	if (!trimmed || trimmed === ":") {
		return { selections: [], hasNegativeIndexing: false, hasExclusions: false };
	}

	// v3.0.0: Only support new bracket syntax with colons
	// Old dash syntax is no longer supported
	if (containsOldDashSyntax(trimmed)) {
		throw new Error(
			`BREAKING CHANGE: The dash syntax '${trimmed}' inside brackets is no longer supported in v3.0.0+. Please use colon syntax instead. Examples: '2-4' → '2:4', '5-7,11' → '5:7,11'. See documentation for the new bracket syntax.`,
		);
	}

	// Parse new bracket syntax
	return parseNewSlicingSyntax(trimmed);
}

function containsOldDashSyntax(selector: string): boolean {
	// Split by comma to check each part
	const parts = selector.split(",").map((p) => p.trim());

	return parts.some((part) => {
		// Skip exclusions for this check
		const cleanPart = part.startsWith("!") ? part.slice(1) : part;

		// Check for old dash range patterns like "2-4" but not negative numbers
		// Old dash syntax: number-number (like "2-4", "10-15")
		// NOT old syntax: "-5" (negative number), "-5:" (negative with colon), "5:-3" (contains colon)

		// If it contains a colon, it's new syntax (even with negative numbers)
		if (cleanPart.includes(":")) {
			return false;
		}

		// Check for dash patterns that are NOT single negative numbers
		if (cleanPart.includes("-")) {
			// Single negative number is new syntax
			if (/^-\d+$/.test(cleanPart)) {
				return false;
			}
			// Dash range like "2-4" is old syntax
			return true;
		}

		return false;
	});
}

function parseNewSlicingSyntax(selector: string): ParsedLineSelector {
	const selections: LineSelection[] = [];
	let hasNegativeIndexing = false;
	let hasExclusions = false;

	// Split by comma to handle multiple selections
	const parts = selector.split(",").map((part) => part.trim());

	for (const part of parts) {
		if (!part) continue;

		// Check for exclusion syntax
		const isExclusion = part.startsWith("!");
		const cleanPart = isExclusion ? part.slice(1) : part;

		if (isExclusion) {
			hasExclusions = true;
		}

		// Parse the individual selection
		const selection = parseIndividualSelection(cleanPart);
		selection.type = isExclusion ? "exclusion" : "inclusion";

		if (selection.isNegative) {
			hasNegativeIndexing = true;
		}

		selections.push(selection);
	}

	return { selections, hasNegativeIndexing, hasExclusions };
}

function parseIndividualSelection(part: string): LineSelection {
	// Handle single line (positive or negative)
	if (!part.includes(":")) {
		const num = Number.parseInt(part);
		if (!Number.isFinite(num)) {
			throw new Error(`Invalid line number: ${part}`);
		}
		return {
			type: "inclusion",
			single: Math.abs(num),
			isNegative: num < 0,
		};
	}

	// Handle range syntax (start:end, start:, :end, :)
	const colonIndex = part.indexOf(":");
	const startStr = part.slice(0, colonIndex);
	const endStr = part.slice(colonIndex + 1);

	let start: number | undefined;
	let end: number | undefined;
	let isNegative = false;

	// Parse start
	if (startStr) {
		start = Number.parseInt(startStr);
		if (!Number.isFinite(start)) {
			throw new Error(`Invalid range start: ${startStr}`);
		}
		if (start < 0) {
			isNegative = true;
			start = Math.abs(start);
		} else if (start < 1) {
			throw new Error("Range start must be positive or negative, not zero");
		}
	}

	// Parse end
	if (endStr) {
		end = Number.parseInt(endStr);
		if (!Number.isFinite(end)) {
			throw new Error(`Invalid range end: ${endStr}`);
		}
		if (end < 0) {
			isNegative = true;
			end = Math.abs(end);
		} else if (end < 1) {
			throw new Error("Range end must be positive or negative, not zero");
		}
	}

	// Validate range logic for positive numbers
	if (start !== undefined && end !== undefined && !isNegative) {
		if (start > end) {
			throw new Error(
				`Range start (${start}) must be less than or equal to range end (${end})`,
			);
		}
	}

	return {
		type: "inclusion",
		start,
		end,
		isNegative,
	};
}
