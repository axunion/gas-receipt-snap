type ConfigListItem = {
	type: string;
	name: string;
	sheetId: string;
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
			folderId: row[4].trim(),
		}));
}

function getConfig(sheetId: string): Config {
	const ss = SpreadsheetApp.openById(sheetId);
	const sheetList = ss.getSheetByName("list");
	const sheetInputs = ss.getSheetByName("inputs");

	if (!sheetList || !sheetInputs) {
		throw new Error("Config not found.");
	}

	const list = sheetList.getDataRange().getValues().slice(1);
	const inputs = sheetInputs.getDataRange().getValues().slice(1);

	return {
		list: list
			.filter((row) => !row[0])
			.map((row) => ({
				type: row[1].trim(),
				name: row[2].trim(),
				sheetId: row[3].trim(),
				folderId: row[4].trim(),
			})),
		inputs: inputs.map((row) => ({
			name: row[0].trim(),
			maxlength: Number.parseInt(row[1]) || 0,
			required: Boolean(row[2]),
		})),
	};
}
