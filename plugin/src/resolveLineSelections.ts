import type { LineSelection } from "./LineSelection.js";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";

export function resolveLineSelections(
  parsed: ParsedLineSelector,
  totalLines: number
): number[] {
  if (totalLines <= 0) {
    return [];
  }

  const includedLines = new Set<number>();
  const excludedLines = new Set<number>();

  // Process all selections
  for (const selection of parsed.selections) {
    const lines = resolveSelection(selection, totalLines);
    addLinesToSet(
      lines,
      selection.type === "inclusion" ? includedLines : excludedLines
    );
  }

  // If no inclusions specified, include all lines
  if (shouldIncludeAllLines(parsed)) {
    addAllLinesToSet(includedLines, totalLines);
  }

  // Apply exclusions
  applyExclusions(includedLines, excludedLines);

  // Return sorted array
  return Array.from(includedLines).sort((a, b) => a - b);
}

function addLinesToSet(lines: number[], targetSet: Set<number>): void {
  for (const line of lines) {
    targetSet.add(line);
  }
}

function shouldIncludeAllLines(parsed: ParsedLineSelector): boolean {
  return (
    parsed.selections.length === 0 ||
    parsed.selections.every((s) => s.type === "exclusion")
  );
}

function addAllLinesToSet(
  includedLines: Set<number>,
  totalLines: number
): void {
  for (let i = 1; i <= totalLines; i++) {
    includedLines.add(i);
  }
}

function applyExclusions(
  includedLines: Set<number>,
  excludedLines: Set<number>
): void {
  for (const excludedLine of excludedLines) {
    includedLines.delete(excludedLine);
  }
}

function resolveSelection(
  selection: LineSelection,
  totalLines: number
): number[] {
  // Handle single line
  if (selection.single !== undefined) {
    return resolveSingleLine(selection, totalLines);
  }

  // Handle range
  return resolveRange(selection, totalLines);
}

function resolveSingleLine(
  selection: LineSelection,
  totalLines: number
): number[] {
  const singleValue = selection.single;
  if (singleValue === undefined) {
    throw new Error("Single line value is undefined");
  }

  const line = selection.isNegative
    ? totalLines - singleValue + 1
    : singleValue;

  if (line < 1 || line > totalLines) {
    throw new Error(
      `Line ${
        selection.isNegative ? -singleValue : singleValue
      } is out of range (file has ${totalLines} lines)`
    );
  }

  return [line];
}

function resolveRange(selection: LineSelection, totalLines: number): number[] {
  let start = selection.start;
  let end = selection.end;

  // Resolve negative indexing
  if (selection.isNegative) {
    ({ start, end } = resolveNegativeRange(start, end, totalLines));
  }

  // Default to full range if not specified
  if (start === undefined) start = 1;
  if (end === undefined) end = totalLines;

  // Validate and clamp bounds
  validateRangeBounds(start, totalLines);
  start = Math.max(1, Math.min(start, totalLines));
  end = Math.max(1, Math.min(end, totalLines));

  if (start > end) {
    return [];
  }

  // Generate range
  return generateRange(start, end);
}

function resolveNegativeRange(
  start: number | undefined,
  end: number | undefined,
  totalLines: number
): { start: number | undefined; end: number | undefined } {
  let newStart = start;
  let newEnd = end;

  if (newStart !== undefined) {
    newStart = totalLines - newStart + 1;
  }
  if (newEnd !== undefined) {
    newEnd = totalLines - newEnd + 1;
  }
  // For negative ranges, swap start and end if needed
  if (newStart !== undefined && newEnd !== undefined && newStart > newEnd) {
    [newStart, newEnd] = [newEnd, newStart];
  }
  return { start: newStart, end: newEnd };
}

function validateRangeBounds(start: number, totalLines: number): void {
  if (start > totalLines) {
    throw new Error(
      `Line ${start} is out of range (file has ${totalLines} lines)`
    );
  }
}

function generateRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}
