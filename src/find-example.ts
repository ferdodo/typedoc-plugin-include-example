import { existsSync, readFileSync } from "fs";
import { Comment } from "typedoc";

export function findExample(comment: Comment): string | null {
	// Check for the @includeExample tag and get its associated file path
	const includeExampleTag = comment.blockTags.find((tag: { tag: string }) => tag.tag === "@includeExample");

	if (!includeExampleTag) {
		return null;
	}

	const filePathWithLines = includeExampleTag.content[0].text;
	const [filePath, lineNumbersString] = filePathWithLines.split(":");

	// Ensure file exists
	if (!existsSync(filePath)) {
		throw new Error(`File not found for ${filePath}`);
	}

	const fileContent = readFileSync(filePath, "utf-8");
	const lines = fileContent.split("\n");

	// If no line numbers are specified, return the whole file
	if (!lineNumbersString) {
		return fileContent;
	}

	const lineNumbers = lineNumbersString.split(",").map((line: string) => line.includes("-") ? line.split("-").map(Number) : Number(line));

	// Ensure line numbers are within file
	lineNumbers.forEach((lineNumber: number | number[]) => {
		if (Array.isArray(lineNumber)) {
			if (lineNumber[0] < 1 || lineNumber[1] > lines.length) {
				throw new Error(
					`Line numbers ${lineNumber[0]}-${lineNumber[1]} are out of range for file ${filePath}`
				);
			}
		} else {
			if (
				lineNumber !== undefined
				&& (lineNumber < 1 || lineNumber > lines.length)
			) {
				throw new Error(
					`Line number ${lineNumber} is out of range for file ${filePath}`
				);
			}
		}
	});

	const selectedLines = lineNumbers.flatMap((lineNumber: number | number[]) =>
		Array.isArray(lineNumber)
			? lines.slice(lineNumber[0] - 1, lineNumber[1])
			: lineNumber !== undefined
			? lines[lineNumber - 1]
			: []
	);

	return selectedLines.join("\n");
}
