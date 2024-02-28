import { Request, Response } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';

export const rolesController = {
	all: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	},
	find: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	},
	create: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	},
	update: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	},
	delete: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	}
};
