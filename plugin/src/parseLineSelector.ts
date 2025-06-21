export function parseLineSelector(lineSelectorString: string): number[] {
	if (lineSelectorString.includes("-")) {
		const lineRange: string[] = lineSelectorString.split("-");
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

		const range: number[] = [];

		for (let i = start; i <= end; i++) {
			range.push(i);
		}

		return range;
	}

	const line = Number.parseInt(lineSelectorString);

	if (!Number.isFinite(line)) {
		throw new Error("Failed to parse line number !");
	}

	return [line];
}
