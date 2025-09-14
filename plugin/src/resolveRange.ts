import type { LineSelection } from "./LineSelection.js";

import { weirdModulo } from "./weirdModulo.js";

export function* resolveRange(
	{ start, end }: LineSelection & { type: "range" },
	total: number,
): Iterable<number> {
	for (
		let i = weirdModulo(start, total);
		i !== weirdModulo(end ?? total, total);
		i = weirdModulo(i + 1, total)
	) {
		if (i !== 0) {
			yield i;
		}
	}

	if (weirdModulo(end ?? total, total) !== 0) {
		yield weirdModulo(end ?? total, total);
	}
}
