type PostSuccessResponse = {
	result: "done";
};

type PostErrorResponse = {
	result: "error";
	error: string;
};

type PostResponse = PostSuccessResponse | PostErrorResponse;

function _doPost() {
	const e = { parameter: { type: "" } };
	const result = doPost(e as unknown as GoogleAppsScript.Events.DoPost);
	console.log(result.getContent());
}

function doPost(
	e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
	let response: PostResponse = { result: "done" };

	try {
		const parameter = JSON.parse(e.postData.contents);
		const { destination, recaptchaToken, receiptImage, noImageReason } =
			parameter;

		if (!destination || !recaptchaToken || (!receiptImage && !noImageReason)) {
			throw new Error("Invalid parameter.");
		}

		const properties = PropertiesService.getScriptProperties().getProperties();
		const secret = properties.RECAPTCHA_SECRET;
		const configSheetId = properties.SPREADSHEET_ID_CONFIG;

		if (!secret || !configSheetId) {
			throw new Error("Invalid script properties.");
		}

		_verifyRecaptcha({ secret, token: recaptchaToken });

		const config = getConfig(configSheetId);
		const validateResult = _validateParameters({
			inputValues: parameter,
			acceptedRows: config.inputs,
		});

		const targetConfig = config.list.find((item) => item.type === destination);

		if (!targetConfig) {
			throw new Error("Invalid destination specified.");
		}

		const { fileId, sheetName, folderId } = targetConfig;
		const sheet = SpreadsheetApp.openById(fileId).getSheetByName(sheetName);

		if (!sheet) {
			throw new Error("Sheet not found.");
		}

		const [date, name, amount, detail, note] = validateResult;
		let receipt = "";

		if (receiptImage) {
			const { mimeType, extension } = _detectImageMimeType({
				base64Data: receiptImage,
			});
			const fileName = `${date}_${name}_${detail}.${extension}`;
			const imageBlob = Utilities.base64Decode(receiptImage);
			const blob = Utilities.newBlob(imageBlob, mimeType, fileName);

			_saveImage({ image: blob, fileName, folderId });
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
