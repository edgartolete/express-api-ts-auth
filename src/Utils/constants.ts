export const Signs = {
	okay: '[ \x1b[32m\u2713 \x1b[0m]',
	warning: '[ \x1b[33m\u0021 \x1b[0m]',
	error: '[ \x1b[31m\u2717 \x1b[0m]'
};

export enum ResponseTypes {
	success = 'SUCCESS',
	duplicate = 'DUPLICATE_FOUND',
	notFound = 'NOT_FOUND',
	invalid = 'INVALID',
	unauthorized = 'UNAUTHORIZED',
	failed = 'FAILED',
	error = 'ERROR',
	unknownError = 'UNKNOWN_ERROR',
	invalidPath = 'INVALID_PATH'
}
