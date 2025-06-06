/**
 * Convert a file into its base-64 representation.
 * @param file input file to convert
 * @returns a promise of a string with the base-64 version of the file contents
 */
export async function fileToBase64(file: File) {
	const buffer = Buffer.from(await file.arrayBuffer());
	return buffer.toString('base64');
}
