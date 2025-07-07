/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized
 */
function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export utils object as default to satisfy exportcase naming convention
const utils = {
	capitalize,
};

export default utils;
