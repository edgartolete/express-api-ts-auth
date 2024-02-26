import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ResponseTypes } from '../Utils/constants';
import { mode } from '../config';

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
