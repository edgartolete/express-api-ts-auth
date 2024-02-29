import { Request, Response } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';
import { App } from '../Entities/appsEntity';
import { AppCreateType, appModel } from '../Models/appsModel';
import { secure } from '../Utils/secure';
import { generateCode, keyGenerator, tryCatchAsync } from '../Utils/helpers';

export const appsController = {
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
		const { code = null, name = null, description = null } = req.body;

		if (code == null) {
			return JsonResponse.incompleteData(res);
		}

		const apiKey = keyGenerator(16);
		const accessTokenSecret = keyGenerator(64);
		const refreshTokenSecret = keyGenerator(64);
		const encryptionKey = keyGenerator(16);

		const app: AppCreateType = {
			code,
			name,
			description,
			apiKey: await secure.hash(apiKey),
			accessTokenSecret: secure.encrypt(accessTokenSecret, apiKey),
			refreshTokenSecret: secure.encrypt(refreshTokenSecret, apiKey)
		};

		const [result, error] = await tryCatchAsync(() => appModel.create(app));

		if (error != null || result == null) {
			return JsonResponse.failed(res, error);
		}

		return JsonResponse.success(
			res,
			{
				code,
				name,
				description,
				apiKey,
				accessTokenSecret,
				refreshTokenSecret
			},
			'Successfully created application.'
		);
	},
	update: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	},
	regenerate: async (req: Request, res: Response) => {
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
