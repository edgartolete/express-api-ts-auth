import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';
import { ResponseTypes } from '../Utils/constants';

export function errorResponse(err: Error, req: Request, res: Response, next: NextFunction) {
	res.json({
		result: err.name,
		message: err.message,
		content: err.stack
	});
}

export function notFound(req: Request, res: Response, next: NextFunction) {
	const err = new Error(`Cannot find the URL path - ${req.originalUrl}`);
	err.name = ResponseTypes.notFound;
	res.status(404);
	next(err);
}
