import { Request, Response } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';

export const authController = {
	signup: async (req: Request, res: Response) => {
		console.log(req.params.app);
		// if (req.params.app !== 'main') return res.json({ message: 'not admin' });
		res.status(200).json({ success: true, app: req.params.app, token: req.query.token });
	},
	signin: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	},
	refresh: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	},
	logout: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	},
	forgot: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	}
};
