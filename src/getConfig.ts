type ConfigListItem = {
	type: string;
	name: string;
	sheetId: string;
	sheetName: string;
	folderId: string;
};
type ConfigInputItem = {
	name: string;
	maxlength: number;
	required: boolean;
};

type Config = {
	list: ConfigListItem[];
	inputs: ConfigInputItem[];
};

function _getConfig(): void {
	const properties = PropertiesService.getScriptProperties().getProperties();
	const config = getConfig(properties.SPREADSHEET_ID_CONFIG);
	console.log(config);
}

function getConfigList(sheetId: string): ConfigListItem[] {
	const ss = SpreadsheetApp.openById(sheetId);
	const sheetList = ss.getSheetByName("list");

	if (!sheetList) {
		throw new Error("Config not found.");
	}

	const list = sheetList.getDataRange().getValues().slice(1);

	return list
		.filter((row) => !row[0])
		.map((row) => ({
			type: row[1].trim(),
			name: row[2].trim(),
			sheetId: row[3].trim(),
			sheetName: row[4].trim(),
			folderId: row[5].trim(),
		}));
}

function getConfig(sheetId: string): Config {
	return {
		list: getConfigList(sheetId),
		inputs: [
			{ name: "date", maxlength: 16, required: true },
			{ name: "name", maxlength: 24, required: true },
			{ name: "amount", maxlength: 8, required: true },
			{ name: "detail", maxlength: 64, required: false },
			{ name: "note", maxlength: 1024, required: false },
			{ name: "noImageReason", maxlength: 1024, required: false },
		],
	};
}
