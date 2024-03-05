import { Request, Response } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';
import { App } from '../Entities/appsEntity';
import { AppCreateType, AppFindType, AppRegenerateType, AppUpdateType, appModel } from '../Models/appsModel';
import { secure } from '../Utils/secure';
import { generateCode, generateId, keyGenerator, tryCatchAsync } from '../Utils/helpers';

export const appsController = {
	find: async (req: Request, res: Response) => {
		const { id = null, code = null } = req.query;

		if (id === null || code === null) {
			const app: AppFindType = {};

			if (id !== null) app.id = parseInt(id.toString());
			if (code !== null) app.code = code.toString();

			const [result, err] = await tryCatchAsync(() => appModel.find(app));
			if (err !== null) {
				return JsonResponse.failed(res, err);
			}

			if (result?.length == 0) {
				return JsonResponse.success(res, [], 'No application with this code.');
			}
			return JsonResponse.success(res, result);
		}
		const [result, err] = await tryCatchAsync(() => appModel.all());

		if (err !== null) {
			return JsonResponse.failed(res, err);
		}
		return JsonResponse.success(res, result, 'All applications');
	},

	create: async (req: Request, res: Response) => {
		const { code = null, name = null, description = null } = req.body;

		if (code == null) {
			return JsonResponse.incompleteData(res);
		}

		const apiKey = keyGenerator(16);
		const accessTokenSecret = keyGenerator(64);
		const refreshTokenSecret = keyGenerator(64);

		const app: AppCreateType = {
			id: generateId(),
			code,
			name,
			description,
			apiKey: await secure.hash(apiKey),
			accessTokenSecret: secure.encrypt(accessTokenSecret, apiKey),
			refreshTokenSecret: secure.encrypt(refreshTokenSecret, apiKey)
		};

		const [result, err] = await tryCatchAsync(() => appModel.create(app));

		if (err != null || result == null) {
			return JsonResponse.failed(res, err);
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
		const { id = null, code = null, name = null, description = null } = req.body;

		if (id === null) {
			return JsonResponse.incompleteData(res, null, 'Required id on body.');
		}

		let app: AppUpdateType = {};

		if (code !== null) app.code = code;
		if (name !== null) app.name = name;
		if (description !== null) app.description = description;

		const [result, err] = await tryCatchAsync(() => appModel.update(id, app));

		if (err !== null) {
			return JsonResponse.failed(res, err);
		}

		if (result?.affected == 0) {
			return JsonResponse.nothingAffected(res, result, 'Update failed.');
		}

		return JsonResponse.success(res, result, 'Successfully updated.');
	},
	regenerate: async (req: Request, res: Response) => {
		const { id = null } = req.body;

		if (id === null) {
			return JsonResponse.incompleteData(res, null, 'Required id on body.');
		}

		const apiKey = secure.salt(16);
		const accessTokenSecret = secure.salt(64);
		const refreshTokenSecret = secure.salt(64);

		const app: AppRegenerateType = {
			apiKey: await secure.hash(apiKey),
			accessTokenSecret: secure.encrypt(accessTokenSecret, apiKey),
			refreshTokenSecret: secure.encrypt(refreshTokenSecret, apiKey)
		};

		const [result, err] = await tryCatchAsync(() => appModel.regenerate(id, app));

		if (err !== null) {
			return JsonResponse.failed(res, err);
		}

		if (result?.affected == 0) {
			return JsonResponse.nothingAffected(res, result, 'Update failed.');
		}

		return JsonResponse.success(res, { apiKey, accessTokenSecret, refreshTokenSecret }, 'Successfully updated.');
	},
	delete: async (req: Request, res: Response) => {
		const { id = null } = req.body;

		if (id === null) {
			return JsonResponse.incompleteData(res, null, 'Required id on body.');
		}

		const [result, err] = await tryCatchAsync(() => appModel.delete(id));

		if (err !== null) {
			return JsonResponse.failed(res, err);
		}

		if (result?.affected == 0) {
			return JsonResponse.nothingAffected(res, result, 'Delete failed. ');
		}

		return JsonResponse.success(res, result);
	}
};
