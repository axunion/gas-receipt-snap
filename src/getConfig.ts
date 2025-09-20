type ConfigListItem = {
	type: string;
	name: string;
	fileId: string;
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

const CONFIG_SHEET_NAME = "config" as const;
const COL_TYPE = 1;
const COL_NAME = 2;
const COL_FILE_ID = 3;
const COL_SHEET_NAME = 4;
const COL_FOLDER_ID = 5;

function _getConfig(): void {
	const properties = PropertiesService.getScriptProperties().getProperties();
	const config = getConfig(properties.SPREADSHEET_ID_CONFIG);
	console.log(config);
}

function getConfigList(fileId: string): ConfigListItem[] {
	const ss = SpreadsheetApp.openById(fileId);
	const sheet = ss.getSheetByName(CONFIG_SHEET_NAME);

	if (!sheet) {
		throw new Error("Config not found.");
	}

	const list = sheet.getDataRange().getValues().slice(1);

	return list
		.filter((row) => !row[0])
		.map((row) => ({
			type: row[COL_TYPE].trim(),
			name: row[COL_NAME].trim(),
			fileId: row[COL_FILE_ID].trim(),
			sheetName: row[COL_SHEET_NAME].trim(),
			folderId: row[COL_FOLDER_ID].trim(),
		}));
}

function getConfig(fileId: string): Config {
	return {
		list: getConfigList(fileId),
		inputs: [
			{ name: "date", maxlength: 16, required: true },
			{ name: "name", maxlength: 24, required: true },
			{ name: "amount", maxlength: 8, required: true },
			{ name: "details", maxlength: 64, required: true },
			{ name: "notes", maxlength: 1024, required: false },
			{ name: "noImageReason", maxlength: 1024, required: false },
		],
	};
}
