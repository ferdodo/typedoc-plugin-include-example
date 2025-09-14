export function parseSpecificPath(tag: string): string | undefined {
	return tag.match(/^([^\[^\]]+?)(\[(.+)\])?$/)?.[1];
}
