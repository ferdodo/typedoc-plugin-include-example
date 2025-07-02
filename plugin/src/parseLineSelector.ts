import type { LineSelection } from "./LineSelection.js";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";

export function parseLineSelector(
	lineSelectorString: string,
): number[] | ParsedLineSelector {
	// Handle empty or whitespace-only selectors
	const trimmed = lineSelectorString.trim();
	if (!trimmed || trimmed === ":") {
		return { selections: [], hasNegativeIndexing: false, hasExclusions: false };
	}

	// Check if this is old syntax (backwards compatibility)
	// Old syntax: single positive numbers, dash ranges, or comma-separated combinations
	// But exclude single negative numbers and anything with colons or exclamations
	if (isOldSyntax(trimmed)) {
		return parseOldSyntax(trimmed);
	}

	// Parse new Python-like syntax
	return parseNewSlicingSyntax(trimmed);
}

function isOldSyntax(selector: string): boolean {
	// Single positive number
	if (/^\d+$/.test(selector)) {
		return true;
	}

	// Contains new syntax features - definitely not old syntax
	if (selector.includes(":") || selector.includes("!")) {
		return false;
	}

	// Single negative number - definitely new syntax
	if (/^-\d+$/.test(selector)) {
		return false;
	}

	// Check if all comma-separated parts are old-style (numbers or dash ranges)
	const parts = selector.split(",").map((p) => p.trim());
	return parts.every((part) => {
		// Single positive number
		if (/^\d+$/.test(part)) {
			return true;
		}
		// Dash range (valid or malformed) - anything with dash that's not a single negative number
		if (part.includes("-") && !/^-\d+$/.test(part)) {
			return true;
		}
		return false;
	});
}

function parseOldSyntax(selector: string): number[] {
	const result: number[] = [];

	// Split by comma to handle multiple selectors
	const parts = selector.split(",").map((p) => p.trim());

	for (const part of parts) {
		if (!part) continue;

		// Handle single line number
		if (!part.includes("-")) {
			const line = Number.parseInt(part);
			if (!Number.isFinite(line)) {
				throw new Error("Failed to parse line number !");
			}
			result.push(line);
			continue;
		}

		// Handle dash range
		const lineRange: string[] = part.split("-");
		const startString: string | undefined = lineRange[0];
		const endString: string | undefined = lineRange[1];
		const start: number = Number.parseInt(startString);
		const end: number = Number.parseInt(endString);

		if (!Number.isFinite(start)) {
			throw new Error("Failed to parse range start !");
		}

		if (!Number.isFinite(end)) {
			throw new Error("Failed to parse range end !");
		}

		if (start < 1) {
			throw new Error("Range start not positive !");
		}

		if (start >= end) {
			throw new Error("Range start is greater or equal to range end !");
		}

		for (let i = start; i <= end; i++) {
			result.push(i);
		}
	}

	return result;
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
