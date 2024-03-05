import { Request, Response, NextFunction } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';
import { secure } from '../Utils/secure';
import { getRuntimeConfig } from '../config';

const { apiKey } = getRuntimeConfig();

export async function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
	const xApiKey = req.headers['x-api-key'] as string;

	if (xApiKey === undefined) {
		return JsonResponse.failed(res, 'No API Key provided.');
	}

	const success = await secure.compare(xApiKey, apiKey);

	if (!success) {
		return JsonResponse.failed(res, 'API Key is incorrect.');
	}
	next();
}
