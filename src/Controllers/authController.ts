import { Request, Response } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';
import { secure } from '../Utils/secure';
import { fakeDelay, generateAccessToken, generateId, tryCatch, tryCatchAsync } from '../Utils/helpers';
import { Log } from '../Connections/mongoDB';
import { getRuntimeConfig } from '../config';
import { UserCreateType, UserFindType, userModel } from '../Models/usersModel';
import jwt, { Secret } from 'jsonwebtoken';

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
		const apiKey = req.headers['x-api-key'] as string;
		const accessTokenSecret = (req.headers['access-token-secret'] as string) ?? '';
		const refreshTokenSecret = (req.headers['refresh-token-secret'] as string) ?? '';

		const { username = null, email = null, password = null } = req.body;

		if (username == null || password == null) {
			return JsonResponse.incompleteData(res);
		}

		const { app: appCode } = req.params;

		const user: UserFindType = { app: { code: appCode } };

		if (username !== null) user.username = username;

		if (email !== null) user.email = email;

		const [result, err] = await tryCatchAsync(() => userModel.find(user));

		if (err !== null) {
			return JsonResponse.failed(res, err);
		}

		if (result == null) {
			return JsonResponse.success(res, result, 'User not found');
		}

		const [found, passErr] = await tryCatchAsync(() => secure.compare(password, result.password));

		if (passErr !== null) {
			return JsonResponse.failed(res, err);
		}

		if (!found) {
			return JsonResponse.success(res, found, 'Password incorrect');
		}

		const [das, dasErr] = tryCatch(() => secure.decrypt(accessTokenSecret, apiKey));

		if (dasErr !== null) return JsonResponse.error(res, dasErr);
		if (das == null) return JsonResponse.failed1(res, null, 'Access Token Secret Decrypt Failed.');

		const [drs, drsErr] = tryCatch(() => secure.decrypt(refreshTokenSecret, apiKey));

		if (drs == null) return JsonResponse.failed1(res, null, 'Refresh Token Secret Decrypt Failed.');

		if (drsErr !== null) return JsonResponse.error(res, drsErr);

		const [accessToken, atErr] = tryCatch(() => {
			return jwt.sign({ id: result.id, username, email }, das, { expiresIn: '10m' });
		});

		if (atErr !== null) return JsonResponse.error(res, atErr);

		if (accessToken === null) return JsonResponse.failed1(res, null, 'Generating Access Token returned null');

		const [refreshToken, rtErr] = tryCatch(() => {
			return jwt.sign({ id: result.id, username, email }, das, { expiresIn: '30d' });
		});

		if (rtErr !== null) return JsonResponse.error(res, rtErr);

		if (refreshToken === null) return JsonResponse.failed1(res, null, 'Generating Refresh Token returned null');

		return JsonResponse.success(res, {
			id: result.id,
			accessToken,
			refreshToken
		});
		// 		export function generateAccessToken(id: number): string {
		// 	const payload = { id };
		// 	const secretKey: Secret = `${process.env.API_KEY}`;
		// 	const token: string = jwt.sign(payload, secretKey, { expiresIn: '1d' });
		// 	return token;
		// }

		// export function generateRefreshToken(id: number): string {
		// 	const payload = { id };
		// 	const secretKey: Secret = `${process.env.API_KEY}`;
		// 	const token: string = jwt.sign(payload, secretKey, { expiresIn: '30d' });
		// 	return token;
		// }

		// export function validateToken(token: string) {
		// 	const secretKey: Secret = `${process.env.API_KEY}`;
		// 	const [decodedToken, err] = tryCatch(() => jwt.verify(token, secretKey));
		// }

		return JsonResponse.success(res, result, 'You are logged-in');

		// find the user using appcode and username. then compare password

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
