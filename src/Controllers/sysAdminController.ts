import { Request, Response } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';
import { sysAdminModel } from '../Models/sysAdminModel';
import { secure } from '../Utils/secure';
import { generateAccessToken, keyGenerator, tryCatchAsync } from '../Utils/helpers';
import { redisClient } from '../Connections/redis';

export const sysAdminController = {
	authenticate: async (req: Request, res: Response) => {
		const { username = null, password = null } = req.body;

		if (username == null || password == null) {
			return JsonResponse.incompleteData(res);
		}

		const [result, error] = await tryCatchAsync(() => sysAdminModel.get());

		if (error != null || result == null) return JsonResponse.failed(res, error);

		if (result[0] === undefined) {
			return JsonResponse.failed(res, error);
		}

		const usernameMatched = await secure.compare(username, result[0].username);
		const passwordMatched = await secure.compare(password, result[0].password);

		if (!usernameMatched || !passwordMatched) {
			return JsonResponse.failed(res, 'Username or Password is incorrect.');
		}

		const key = keyGenerator(64);

		const salt = secure.salt();

		const [pbkdfResult, pbkdfError] = await tryCatchAsync(() => secure.generatePBKDF2Key(key, salt));

		if (pbkdfError != null || pbkdfResult == null) {
			return JsonResponse.failed(res, pbkdfError);
		}

		console.log('key: ', key);
		console.log('salt: ', salt);
		console.log('pbkdf: ', pbkdfResult.key);

		redisClient.setEx('pbkdf', 120, pbkdfResult.key);
		redisClient.setEx('salt', 120, salt);

		return JsonResponse.success(res, {
			token: key
		});
	},
	updateUsername: async (req: Request, res: Response) => {
		return JsonResponse.success(res);
	},
	updatePassword: async (req: Request, res: Response) => {
		try {
			JsonResponse.success(res);
			return;
		} catch (err) {
			JsonResponse.failed(res, err);
		}
	}
};
