type GetSuccessResponse = {
	result: "done";
	data: {
		value: string;
		label: string;
	}[];
};

type GetErrorResponse = {
	result: "error";
	error: string;
};

type GetResponse = GetSuccessResponse | GetErrorResponse;

function _doGet() {
	const result = doGet();
	console.log(result.getContent());
}

function doGet(): GoogleAppsScript.Content.TextOutput {
	let response: GetResponse;

	try {
		const properties = PropertiesService.getScriptProperties().getProperties();
		const configList = getConfigList(properties.SPREADSHEET_ID_CONFIG);

		response = {
			result: "done",
			data: configList.map((item) => ({
				value: item.type,
				label: item.name,
			})),
		};
	} catch (error) {
		response = {
			result: "error",
			error: error.message,
		};
	}

	return ContentService.createTextOutput(JSON.stringify(response));
}
