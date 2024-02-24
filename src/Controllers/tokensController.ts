import { Request, Response } from 'express';
import { ResponseTypes } from '../Utils/constants';
import { JsonResponse, catchErrorResponse } from '../Utils/responseTemplate';

export const tokensController = {
	refresh: (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
		} catch (err) {
			catchErrorResponse(res, err);
		}
	}
};
