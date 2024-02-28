import { Request, Response, NextFunction } from 'express';
import { mode } from '../config';
import { JsonResponse } from '../Utils/responseTemplate';

export function appCodeMiddleware(req: Request, res: Response, next: NextFunction) {
	const { app: appCode = null } = req.params;
	if (appCode === null) {
		return res.json({ message: 'No application selected.' });
	}
	if (appCode == '_') {
		return JsonResponse.success(res, null, 'Application is main');
	}
	next();
}
