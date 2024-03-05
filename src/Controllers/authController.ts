import { Request, Response } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';
import { secure } from '../Utils/secure';
import { fakeDelay, generateId, tryCatch, tryCatchAsync } from '../Utils/helpers';
import { Log } from '../Connections/mongoDB';
import { getRuntimeConfig } from '../config';
import { UserCreateType, userModel } from '../Models/usersModel';

const { encryptionKey } = getRuntimeConfig();

export const authController = {
	signup: async (req: Request, res: Response) => {
		const {
			username = null,
			email = null,
			password = null,
			firstName = null,
			middleName = null,
			lastName = null
		} = req.body;

		if (username == null || email == null || password == null) {
			return JsonResponse.incompleteData(res, 'Required username, email, password');
		}

		const { app: appCode } = req.params;

		const user: UserCreateType = {
			app: { code: appCode },
			id: generateId(),
			username,
			email,
			password: await secure.hash(password)
		};

		const [result, err] = await tryCatchAsync(() => userModel.create(user));

		if (err !== null) {
			return JsonResponse.failed(res, err);
		}

		return JsonResponse.success(res, result, 'Successfully added.');
	},
	verify: async (req: Request, res: Response) => {
		//after the user signup, they need to verify their email address to make sure they are human.
		// receive the token that contains the the username email and password.
	},
	signin: async (req: Request, res: Response) => {
		const { username = null, email = null, password = null } = req.body;

		if (username == null || password == null) {
			return JsonResponse.incompleteData(res);
		}

		if (username != null) {
			// find the user using appcode and username. then compare password
		} else {
			// else if username is not provided use appcode and email address.
		}

		// if success, start decrypting the secrets and make an access and refresh token.

		const [accessSecret, accessErr] = tryCatch(() =>
			secure.decrypt(req.headers['access-encrypted']!.toString(), req.headers['x-api-key']!.toString())
		);

		if (accessErr != null) {
			return JsonResponse.failed(res, accessErr);
		}

		const [refreshSecret, refreshErr] = tryCatch(() =>
			secure.decrypt(req.headers['refresh-encrypted']!.toString(), req.headers['x-api-key']!.toString())
		);

		if (refreshErr != null) {
			return JsonResponse.failed(res, refreshErr);
		}

		// if nothing else fail. generate the token.

		return JsonResponse.success(res);
	},
	twoFactorAuthentication: async () => {
		// this should be dynamic based on app if they want to enable.
	},
	refresh: async (req: Request, res: Response) => {
		try {
			const refreshTokenSecret = req.headers['refresh-token-secret'];

			await fakeDelay(3000);
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
