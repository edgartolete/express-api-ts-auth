type EmailRequestPayload = {
	to: string;
	subject: string;
	body: string;
};

export interface ErrorResponse extends Error {
	status: number;
}
