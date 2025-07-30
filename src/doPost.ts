type PostSuccessResponse = {
	result: "done";
};

type PostErrorResponse = {
	result: "error";
	error: string;
};

type PostResponse = PostSuccessResponse | PostErrorResponse;

function doPost(
	e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
	let response: PostResponse = { result: "done" };

	try {
		const parameter = JSON.parse(e.postData.contents);
		const { type, recaptchaToken, image, noImageReason } = parameter;

		if (!type || !recaptchaToken || (!image && !noImageReason)) {
			throw new Error("Invalid parameter.");
		}

		const properties = PropertiesService.getScriptProperties().getProperties();
		const secret = properties.RECAPTCHA_SECRET;
		const configSheetId = properties.SPREADSHEET_ID_CONFIG;

		if (!secret || !configSheetId) {
			throw new Error("Invalid script properties.");
		}

		const config = getConfig(configSheetId);
		const checkResult = validateParameters({
			inputValues: parameter,
			acceptedRows: config.inputs,
		});

		if (checkResult.errors.length > 0) {
			throw new Error(`Invalid Parameter: ${checkResult.errors.join(", ")}`);
		}

		const recaptchaResponse = verifyRecaptcha({
			secret,
			token: recaptchaToken,
		});

		if (!recaptchaResponse.success || recaptchaResponse.score < 0.5) {
			const score = recaptchaResponse.score || "-";
			const errorCodes = recaptchaResponse["error-codes"]?.join(" ") || "";
			throw new Error(`reCAPTCHA verification failed. ${score} ${errorCodes}`);
		}

		const targetConfig = config.list.find((item) => item.type === type);

		if (!targetConfig) {
			throw new Error("Invalid type specified.");
		}

		const { sheetId, sheetName, folderId } = targetConfig;
		const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);

		if (!sheet) {
			throw new Error("Sheet not found.");
		}

		const [date, name, amount, detail, note] = checkResult.values;
		let receipt: string;

		if (image) {
			const { mimeType, extension } = detectImageMimeType({
				base64Data: image,
			});
			const fileName = `${date}_${name}_${detail}.${extension}`;
			const imageBlob = Utilities.base64Decode(image);
			const blob = Utilities.newBlob(imageBlob, mimeType, fileName);

			saveImage({ image: blob, fileName, folderId });
			receipt = fileName;
		} else {
			receipt = noImageReason;
		}

		sheet.appendRow([date, name, amount, detail, receipt, note]);
	} catch (error) {
		response = {
			result: "error",
			error: error.message,
		};
	}

	return ContentService.createTextOutput(JSON.stringify(response));
}
