/**
 * Detects image MIME type and file extension from base64 data by analyzing magic bytes.
 *
 * @param params - Parameters for image type detection.
 * @param params.base64Data - The base64 encoded image data. Can include data URL prefix or be raw base64.
 * @returns An object containing the detected MIME type and file extension.
 * @throws Error if base64Data is empty or invalid.
 */
function detectImageMimeType(params: {
	base64Data: string;
}): { mimeType: string; extension: string } {
	const { base64Data } = params;

	if (
		!base64Data ||
		typeof base64Data !== "string" ||
		base64Data.trim() === ""
	) {
		throw new Error("Base64 data is required and must be a non-empty string.");
	}

	// Remove data URL prefix if present
	const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

	if (cleanBase64 === "") {
		throw new Error("Invalid base64 data format.");
	}

	try {
		// Decode first few bytes to check magic bytes
		const binaryString = Utilities.base64Decode(cleanBase64);
		const bytes = new Uint8Array(binaryString);

		// Check magic bytes for common image formats
		if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
			return { mimeType: "image/jpeg", extension: "jpg" };
		}
		if (
			bytes[0] === 0x89 &&
			bytes[1] === 0x50 &&
			bytes[2] === 0x4e &&
			bytes[3] === 0x47
		) {
			return { mimeType: "image/png", extension: "png" };
		}
		if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
			return { mimeType: "image/gif", extension: "gif" };
		}
		if (
			bytes[0] === 0x52 &&
			bytes[1] === 0x49 &&
			bytes[2] === 0x46 &&
			bytes[3] === 0x46 &&
			bytes[8] === 0x57 &&
			bytes[9] === 0x45 &&
			bytes[10] === 0x42 &&
			bytes[11] === 0x50
		) {
			return { mimeType: "image/webp", extension: "webp" };
		}

		// Default to JPEG if unknown format
		return { mimeType: "image/jpeg", extension: "jpg" };
	} catch (error) {
		throw new Error(`Failed to decode base64 data: ${error.message}`);
	}
}
