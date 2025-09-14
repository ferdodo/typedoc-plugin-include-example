export function checkLegacySyntax(tag: string) {
	const colonIndex = tag.lastIndexOf(":");

	console.log({ colonIndex });

	if (colonIndex !== -1) {
		const potentialPath = tag.substring(0, colonIndex);
		const potentialSelector = tag.substring(colonIndex + 1);
		console.log({ potentialPath, potentialSelector });

		if (potentialSelector.trim() && /^[\d\-,\s]+$/.test(potentialSelector)) {
			throw new Error(
				`BREAKING CHANGE: The colon syntax '${tag}' is no longer supported in v3.0.0+. Please migrate to the new bracket syntax: '${potentialPath}[${potentialSelector.replace(
					/-/g,
					":",
				)}]'. See documentation for the new bracket syntax.`,
			);
		}
	}
}
