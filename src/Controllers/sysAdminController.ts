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

		const hash = await secure.hash(username + password);

		const salt = secure.salt(64);

		const [pbkdfResult, pbkdfError] = await tryCatchAsync(() => secure.generatePBKDF2Key(hash, salt));

		if (pbkdfError != null || pbkdfResult == null) {
			return JsonResponse.failed(res, pbkdfError);
		}

		redisClient.setEx('pbkdf', 120, pbkdfResult.key);
		redisClient.setEx('hash', 120, hash);

		return JsonResponse.success(res, {
			token: salt
		});
	},
	updateUsername: async (req: Request, res: Response) => {
		return JsonResponse.success(res);
	},
	updatePassword: async (req: Request, res: Response) => {
		return JsonResponse.success(res);
	},
	logout: async (req: Request, res: Response) => {
		const pbkdfDel = await redisClient.del('pbkdf');
		const hashDel = await redisClient.del('hash');

		if (pbkdfDel !== 1 && hashDel !== 1) {
			return JsonResponse.nothingAffected(res, null, 'You are not logged-in.');
		}
		return JsonResponse.success(res, null, 'You are not successfully logged-out.');
	}
};
