import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { ResponseTypes } from '../Utils/constants';
import { mode } from '../config';
import { redisClient } from '../Connections/redis';
import { JsonResponse } from '../Utils/responseTemplate';
import { tryCatch, tryCatchAsync } from '../Utils/helpers';
import { secure } from '../Utils/secure';

export async function accessTokenMiddleware(req: Request, res: Response, next: NextFunction) {
	const apiKey = req.headers['x-api-key'] as string;
	const accessTokenSecret = (req.headers['access-token-secret'] as string) ?? '';

	const accessToken = req.headers.authorization;
	if (accessToken === undefined) {
		return JsonResponse.unauthorized(res, 'Required authorization.');
	}

	const [das, dasErr] = tryCatch(() => secure.decrypt(accessTokenSecret, apiKey));
	if (dasErr !== null) return JsonResponse.error(res, dasErr);
	if (das == null) return JsonResponse.failed1(res, null, 'Access Token Secret Decrypt Failed.');

	const [dt, dtErr] = tryCatch(() => jwt.verify(accessToken, das as Secret));

	if (dtErr !== null || dt == null) return JsonResponse.unauthorized(res, 'Token expired. Signin again.');

	const { id } = dt as JwtPayload;

	const redisAccessToken = await redisClient.get(`${id}-access-token`);

	if (redisAccessToken == null) {
		return JsonResponse.unauthorized(res, 'Token invalid. Signin again.');
	}

	req.headers['user-id'] = id;

	next();
}

export async function sysAdminTokenMiddleware(req: Request, res: Response, next: NextFunction) {
	const userId = req.headers['user-id'] || '';
	const token = req.headers['authorization'] || '';

	if (userId === '') {
		return JsonResponse.incompleteData(res, null, 'Required user-id on headers.');
	}

	if (token === '') {
		return JsonResponse.incompleteData(res, null, 'Required authorization on headers.');
	}

	const pbkdf = await redisClient.get(`${userId}-pbkdf`);
	const hash = await redisClient.get(`${userId}-hash`);

	if (pbkdf === null || hash === null) {
		res.status(401).json({
			result: ResponseTypes.invalid,
			message: 'Unauthorized request. Token invalid or expired'
		});
		return;
	}

	const [pbkdfResult, pbkdfError] = await tryCatchAsync(() =>
		secure.generatePBKDF2Key(hash, req.headers.authorization!)
	);
	if (pbkdfError != null || pbkdfResult == null) {
		return JsonResponse.failed(res, pbkdfError);
	}

	if (pbkdfResult.key !== pbkdf) {
		return JsonResponse.failed(res, 'Unauthorized request. Token invalid or expired');
	}

	redisClient.setEx(`${userId}-pbkdf`, 300, pbkdf);
	redisClient.setEx(`${userId}-hash`, 300, hash);

	next();
}
