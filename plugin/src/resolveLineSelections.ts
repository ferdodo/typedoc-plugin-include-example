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
		const targetSet = selection.isExclusion ? excludedLines : includedLines;
		for (const line of lines) {
			targetSet.add(line);
		}
	}

	// If no inclusions specified, include all lines
	if (shouldIncludeAllLines(parsed)) {
		for (let i = 1; i <= totalLines; i++) {
			includedLines.add(i);
		}
	}

	// Apply exclusions
	for (const line of excludedLines) {
		includedLines.delete(line);
	}

	// Return sorted array
	return Array.from(includedLines).sort((a, b) => a - b);
}

function resolveSelection(
	selection: LineSelection,
	totalLines: number,
): number[] {
	switch (selection.type) {
		case "single":
			return resolveLine(selection, totalLines);
		case "range":
			return resolveRange(selection, totalLines);
	}
}

function resolveLine(
	selection: LineSelection & { type: "single" },
	totalLines: number,
): number[] {
	const line =
		selection.line < 0
			? totalLines + selection.line + 1 // Convert negative index to positive index
			: selection.line;

	if (line < 1 || line > totalLines) {
		throw new Error(
			`Line ${selection.line} is out of range (file has ${totalLines} lines)`,
		);
	}

	return [line];
}

function resolveRange(
	selection: LineSelection & { type: "range" },
	totalLines: number,
): number[] {
	let start = selection.start;
	let end = selection.end;

	// Convert negative index to positive index
	if (start !== undefined && start < 0) {
		start = totalLines + start + 1;
	}
	if (end !== undefined && end < 0) {
		end = totalLines + end + 1;
	}

	// Default to full range if not specified
	if (start === undefined) start = 1;
	if (end === undefined) end = totalLines;

	// Validate bounds - be more lenient for empty files
	if (totalLines === 0) {
		return [];
	}

	// Clamp to valid range
	start = Math.max(1, Math.min(start, totalLines));
	end = Math.max(1, Math.min(end, totalLines));

	if (start > end) {
		return [];
	}

	const result: number[] = [];
	for (let i = start; i <= end; i++) {
		result.push(i);
	}
	return result;
}

function shouldIncludeAllLines(parsed: ParsedLineSelector): boolean {
	return (
		parsed.selections.length === 0 ||
		parsed.selections.every((s) => s.isExclusion)
	);
}
