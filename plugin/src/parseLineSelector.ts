import type { LineSelection } from "./LineSelection.js";
import type { ParsedLineSelector } from "./ParsedLineSelector.js";

export function parseLineSelector(
  lineSelectorString: string
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
      `BREAKING CHANGE: The dash syntax '${trimmed}' inside brackets is no longer supported in v3.0.0+. Please use colon syntax instead. Examples: '2-4' → '2:4', '5-7,11' → '5:7,11'. See documentation for the new bracket syntax.`
    );
  }

  // Parse new bracket syntax
  return parseNewSlicingSyntax(trimmed);
}

function containsOldDashSyntax(selector: string): boolean {
  return selector
    .split(",")
    .map((p) => p.trim())
    .some(hasOldDashPattern);
}

function hasOldDashPattern(part: string): boolean {
  // Skip exclusions for this check
  const cleanPart = part.startsWith("!") ? part.slice(1) : part;

  // If it contains a colon, it's new syntax (even with negative numbers)
  if (cleanPart.includes(":")) {
    return false;
  }

  // Check for dash patterns that are NOT single negative numbers
  if (cleanPart.includes("-")) {
    // Single negative number is new syntax
    if (isNegativeNumber(cleanPart)) {
      return false;
    }
    // Dash range like "2-4" is old syntax
    return true;
  }

  return false;
}

function isNegativeNumber(value: string): boolean {
  return /^-\d+$/.test(value);
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
    return parseSingleLine(part);
  }

  // Handle range syntax (start:end, start:, :end, :)
  return parseRange(part);
}

function parseSingleLine(part: string): LineSelection {
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

function parseRange(part: string): LineSelection {
  const colonIndex = part.indexOf(":");
  const startStr = part.slice(0, colonIndex);
  const endStr = part.slice(colonIndex + 1);

  const { start, end, isNegative } = parseRangeNumbers(startStr, endStr);

  validateRangeLogic(start, end, isNegative);

  return {
    type: "inclusion",
    start,
    end,
    isNegative,
  };
}

function parseRangeNumbers(startStr: string, endStr: string) {
  let start: number | undefined;
  let end: number | undefined;
  let isNegative = false;

  // Parse start
  if (startStr) {
    start = parseRangeNumber(startStr, "start");
    if (start < 0) {
      isNegative = true;
      start = Math.abs(start);
    }
  }

  // Parse end
  if (endStr) {
    end = parseRangeNumber(endStr, "end");
    if (end < 0) {
      isNegative = true;
      end = Math.abs(end);
    }
  }

  return { start, end, isNegative };
}

function parseRangeNumber(value: string, type: "start" | "end"): number {
  const num = Number.parseInt(value);
  if (!Number.isFinite(num)) {
    throw new Error(`Invalid range ${type}: ${value}`);
  }
  if (num === 0) {
    throw new Error(`Range ${type} must be positive or negative, not zero`);
  }
  return num;
}

function validateRangeLogic(
  start: number | undefined,
  end: number | undefined,
  isNegative: boolean
): void {
  // Validate range logic for positive numbers
  if (start !== undefined && end !== undefined && !isNegative) {
    if (start > end) {
      throw new Error(
        `Range start (${start}) must be less than or equal to range end (${end})`
      );
    }
  }
}
