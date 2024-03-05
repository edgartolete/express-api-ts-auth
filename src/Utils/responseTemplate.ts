import { Response } from 'express';
import { ResponseTypes } from './constants';

export const JsonResponse = {
	success: (res: Response, content: any = 'No Content.', message: string | null = null) => {
		res.status(200);
		res.json({
			result: ResponseTypes.success,
			message: message ?? 'Request Successful',
			content: content
		});
	},
	nothingAffected: (res: Response, content: any = 'No content.', message: string | null = null) => {
		res.status(200);
		res.json({
			result: ResponseTypes.failed,
			message: message ?? 'Nothing was affected.',
			content: content
		});
	},
	incompleteData: (res: Response, content: any = null, message: string | null = null) => {
		res.status(422);
		res.json({
			result: ResponseTypes.invalid,
			message: message ?? 'One or more required information is missing from the request',
			content: content ?? 'No Content.'
		});
	},
	failed: (res: Response, err: unknown) => {
		res.status(200);
		if (err instanceof Error) {
			res.json({
				result: err.name,
				message: err.message,
				content: err.stack
			});
		} else {
			res.json({
				result: ResponseTypes.failed,
				message: 'Try Catch Error. Error not Instance of Error',
				content: err
			});
		}
	},
	failed1: (res: Response, content: any = 'No content.', message: string = 'No Message') => {
		res.status(200);
		res.json({
			result: ResponseTypes.failed,
			content,
			message
		});
	},
	error: (res: Response, err: unknown) => {
		res.status(500);
		if (err instanceof Error) {
			res.json({
				result: err.name,
				message: err.message,
				content: err.stack
			});
		} else {
			res.json({
				result: ResponseTypes.error,
				message: 'Try Catch Error. Error not Instance of Error',
				content: err
			});
		}
	}
};
