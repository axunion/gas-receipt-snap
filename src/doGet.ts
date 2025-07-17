type GetResponse = {
	result: "done" | "error";
	data?: {
		value: string;
		label: string;
	}[];
	error?: string;
};

function _doGet() {
	const result = doGet();
	console.log(result.getContent());
}

function doGet(): GoogleAppsScript.Content.TextOutput {
	const response: GetResponse = { result: "done" };

	try {
		const properties = PropertiesService.getScriptProperties().getProperties();
		const configList = getConfigList(properties.SPREADSHEET_ID_CONFIG);

		response.data = configList.map((item) => ({
			value: item.type,
			label: item.name,
		}));
	} catch (error) {
		response.result = "error";
		response.error = error.message;
	}

	return ContentService.createTextOutput(JSON.stringify(response));
}
