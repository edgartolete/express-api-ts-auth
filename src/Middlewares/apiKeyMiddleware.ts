import { Request, Response, NextFunction } from 'express';

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
	if (req.headers['x-api-key'] !== process.env.API_KEY) {
		res.status(401).json({ message: 'Unauthorized request. No API Key provided' });
		return;
	}
	next();
}
