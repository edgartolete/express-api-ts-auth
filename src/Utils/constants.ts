export const Signs = {
	okay: '[ \x1b[32m\u2713 \x1b[0m]',
	warning: '[ \x1b[33m\u0021 \x1b[0m]',
	error: '[ \x1b[31m\u2717 \x1b[0m]'
};

export enum ResponseTypes {
	success = 'SUCCESS',
	created = 'CREATED',
	duplicate = 'DUPLICATE_FOUND',
	found = 'FOUND',
	notFound = 'NOT_FOUND',
	incorrectPassword = 'INCORRECT_PASSWORD',
	valid = 'VALID',
	invalid = 'INVALID',
	failed = 'FAILED',
	unknown = 'UNKNOWN',
	errorHashing = 'ERROR_HASHING'
}
