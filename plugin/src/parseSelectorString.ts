export function parseSelectorString(tag: string): string | undefined {
	return tag.match(/^([^\[^\]]+?)\[(.*)?\]$/)?.[2];
}
