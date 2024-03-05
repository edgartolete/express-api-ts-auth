import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ResponseTypes } from '../Utils/constants';
import { mode } from '../config';
import { redisClient } from '../Connections/redis';
import { JsonResponse } from '../Utils/responseTemplate';
import { tryCatchAsync } from '../Utils/helpers';
import { secure } from '../Utils/secure';

export function accessTokenMiddleware(req: Request, res: Response, next: NextFunction) {
	if (mode['dev']) next();
	if (req.headers.authorization == null) {
		res.status(401).json({
			result: ResponseTypes.invalid,
			message: 'Unauthorized request. No provided Access Token'
		});
		return;
	}

	if (isAccessTokenValid(`"${req.headers.authorization}"`)) {
		res.status(401).json({
			result: ResponseTypes.invalid,
			message: 'Unauthorized request. Provided Access Token is invalid or expired'
		});
		return;
	}
	next();
}

export function generateAccessToken(id: number): string {
	const payload = { id };
	const secret: Secret = `${process.env.ACCESS_TOKEN_SECRET}`;
	const options: SignOptions = { expiresIn: '10m' };
	const token: string = jwt.sign(payload, secret, options);
	return token;
}

export function generateRefreshToken(id: number): string {
	const payload = { id };
	const secret: Secret = `${process.env.REFRESH_TOKEN_SECRET}`;
	const options: SignOptions = { expiresIn: '30d' };
	const token: string = jwt.sign(payload, secret, options);
	return token;
}

export function isAccessTokenValid(token: string) {
	const secretKey: Secret = `${process.env.ACCESS_TOKEN_SECRET}`;
	try {
		const decodedToken = jwt.verify(token, secretKey);
		return true;
	} catch (error) {
		return false;
	}
}

export function isRefreshTokenValid(token: string) {
	const secretKey: Secret = `${process.env.REFRESH_TOKEN_SECRET}`;
	try {
		const decodedToken = jwt.verify(token, secretKey);
		return true;
	} catch (error) {
		return false;
	}
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
		console.log('ttl: pbkdf', await redisClient.ttl('pbkdf'));
		console.log('ttl: hash', await redisClient.ttl('hash'));
		return JsonResponse.failed(res, 'Unauthorized request. Token invalid or expired');
	}

	redisClient.setEx('pbkdf', 120, pbkdf);
	redisClient.setEx('hash', 120, hash);

	next();
}
