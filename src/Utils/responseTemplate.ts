import { Response } from 'express';
import { ResponseTypes } from './constants';

export const JsonResponse = {
	incompleteData: (res: Response) => {
		res.status(422);
		res.json({
			result: ResponseTypes.invalid,
			message: 'One or more required information is missing from the request',
			content: 'No Content.'
		});
	},
	success: (res: Response, content: any = 'No Content.', message: string | null = null) => {
		res.status(200);
		res.json({
			result: ResponseTypes.success,
			message: message ?? 'Request Successful',
			content: content
		});
	},
	nothingAffected: (res: Response, content: any = 'No content.') => {
		res.status(200);
		res.json({
			result: ResponseTypes.failed,
			message: 'Nothing was affected.',
			content: content
		});
	},
	failed: (res: Response, err: unknown) => {
		res.status(500);
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
	}
};
