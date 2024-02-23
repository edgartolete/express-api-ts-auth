import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { ResponseTypes } from '../Utils/constants';

export function accessTokenMiddleware(req: Request, res: Response, next: NextFunction) {
	if (req.headers.authorization == null) {
		res.status(401).json({
			result: ResponseTypes.invalid,
			message: 'Unauthorized request. No provided Access Token'
		});
		return;
	}

	if (validateToken(`"${req.headers.authorization}"`).result == ResponseTypes.success) {
		res.status(401).json({
			result: ResponseTypes.invalid,
			message: 'Unauthorized request. Provided Access Token is invalid'
		});
		return;
	}

	next();
}

function generateAccessToken(id: number): string {
	const payload = { id };
	const secretKey: Secret = `${process.env.API_KEY}`;
	const token: string = jwt.sign(payload, secretKey, { expiresIn: '1d' });
	return token;
}

function generateRefreshToken(id: number): string {
	const payload = { id };
	const secretKey: Secret = `${process.env.API_KEY}`;
	const token: string = jwt.sign(payload, secretKey, { expiresIn: '30d' });
	return token;
}

function validateToken(token: string) {
	const secretKey: Secret = `${process.env.API_KEY}`;
	try {
		const decodedToken = jwt.verify(token, secretKey);
		return { result: ResponseTypes.success, content: decodedToken };
	} catch (error) {
		return { result: ResponseTypes.invalid, content: error };
	}
}
