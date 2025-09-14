import type { LineSelection } from "./LineSelection.js";
import { resolveRange } from "./resolveRange.js";

export function resolveLineSelections(
	selections: LineSelection[],
	totalLines: number,
): number[] {
	const includedLines = new Set<number>();
	const excludedLines = new Set<number>();

	// Process all selections
	for (const selection of selections) {
		const lines = resolveSelection(selection, totalLines);
		const targetSet = selection.isExclusion ? excludedLines : includedLines;
		for (const line of lines) {
			targetSet.add(line);
		}
	}

	// If no inclusions specified, include all lines
	if (selections.every((s) => s.isExclusion)) {
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
			return Array.from(resolveRange(selection, totalLines));
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
