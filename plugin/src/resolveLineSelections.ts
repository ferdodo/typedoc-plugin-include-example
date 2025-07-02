import type { LineSelection } from "./LineSelection.js";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";

export function resolveLineSelections(
	parsed: ParsedLineSelector,
	totalLines: number,
): number[] {
	if (totalLines <= 0) {
		return [];
	}

	const includedLines = new Set<number>();
	const excludedLines = new Set<number>();

	// Process all selections
	for (const selection of parsed.selections) {
		const lines = resolveSelection(selection, totalLines);

		if (selection.type === "inclusion") {
			for (const line of lines) {
				includedLines.add(line);
			}
		} else {
			for (const line of lines) {
				excludedLines.add(line);
			}
		}
	}

	// If no inclusions specified, include all lines
	if (
		parsed.selections.length === 0 ||
		parsed.selections.every((s) => s.type === "exclusion")
	) {
		for (let i = 1; i <= totalLines; i++) {
			includedLines.add(i);
		}
	}

	// Apply exclusions
	for (const excludedLine of excludedLines) {
		includedLines.delete(excludedLine);
	}

	// Return sorted array
	return Array.from(includedLines).sort((a, b) => a - b);
}

function resolveSelection(
	selection: LineSelection,
	totalLines: number,
): number[] {
	// Handle single line
	if (selection.single !== undefined) {
		const line = selection.isNegative
			? totalLines - selection.single + 1
			: selection.single;

		if (line < 1 || line > totalLines) {
			throw new Error(
				`Line ${
					selection.isNegative ? -selection.single : selection.single
				} is out of range (file has ${totalLines} lines)`,
			);
		}

		return [line];
	}

	// Handle range
	let start = selection.start;
	let end = selection.end;

	// Resolve negative indexing
	if (selection.isNegative) {
		if (start !== undefined) {
			start = totalLines - start + 1;
		}
		if (end !== undefined) {
			end = totalLines - end + 1;
		}
		// For negative ranges, swap start and end if needed
		if (start !== undefined && end !== undefined && start > end) {
			[start, end] = [end, start];
		}
	}

	// Default to full range if not specified
	if (start === undefined) start = 1;
	if (end === undefined) end = totalLines;

	// Check for completely out-of-bounds ranges
	if (start > totalLines) {
		throw new Error(
			`Line ${start} is out of range (file has ${totalLines} lines)`,
		);
	}

	// Validate bounds (clamp to valid range)
	start = Math.max(1, Math.min(start, totalLines));
	end = Math.max(1, Math.min(end, totalLines));

	if (start > end) {
		return [];
	}

	// Generate range
	const result: number[] = [];
	for (let i = start; i <= end; i++) {
		result.push(i);
	}

	return result;
}
