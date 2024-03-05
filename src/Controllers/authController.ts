import { Request, Response } from 'express';
import { JsonResponse } from '../Utils/responseTemplate';
import { secure } from '../Utils/secure';
import { fakeDelay, tryCatch } from '../Utils/helpers';
import { Log } from '../Connections/mongoDB';

export const authController = {
	signup: async (req: Request, res: Response) => {
		await fakeDelay(3000);
		// if (req.params.app !== 'main') return res.json({ message: 'not admin' });
		res.status(200).json({ success: true, app: req.params.app });

		// Log.request(req, res);
		// search the database if the username or email is taken. do not make entry.

		// do less work here if possible as registering users maybe bot. prioritize filtering the bot.

		// generate a jwt token containing the  username, email, and hashed password then end the token to the user email.

		// token secret is not access or refresh token, they will comes from global environment variable
	},
	verify: async (req: Request, res: Response) => {
		//after the user signup, they need to verify their email address to make sure they are human.
		// receive the token that contains the the username email and password.
	},
	signin: async (req: Request, res: Response) => {
		const { username = null, password = null } = req.body;

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

			console.log('refresh token secret: ', refreshTokenSecret);

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
