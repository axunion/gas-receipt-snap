type GetResponse = {
	result: "done" | "error";
	data?: PurposeResponse[];
	error?: string;
};

function _doGet() {
	const e = { parameter: { type: "" } };
	const result = doGet(e as unknown as GoogleAppsScript.Events.DoGet);
	console.log(result.getContent());
}

function doGet(
	e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.Content.TextOutput {
	const response: GetResponse = { result: "done" };

	try {
		const properties = PropertiesService.getScriptProperties().getProperties();
		const config = getConfigPurpose(properties.SPREADSHEET_ID_CONFIG);

		response.data = config.list.map((item) => ({
			value: item.type,
			label: item.name,
		}));
	} catch (error) {
		response.result = "error";
		response.error = error.message;
	}

	return ContentService.createTextOutput(JSON.stringify(response));
}
