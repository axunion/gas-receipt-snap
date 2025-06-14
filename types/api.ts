interface PurposeResponse {
	value: string;
	label: string;
}

interface SubmitRequest {
	name: string;
	amount: string;
	date: string;
	details: string;
	purpose: string;
	notes?: string;
}

interface SubmitResponse {
	success: boolean;
	error?: {
		code: string;
		message: string;
	};
}
