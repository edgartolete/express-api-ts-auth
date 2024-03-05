/** this route will allow users to authenticate users */

import express, { Router } from 'express';
import { authController } from '../Controllers/authController';
import { appCodeMiddleware } from '../Middlewares/appCodeMiddleware';
import { accessTokenMiddleware } from '../Middlewares/tokenMiddleware';

const router: Router = express.Router({ mergeParams: true });

router.post('/signup', authController.signup);

router.post('/signin', authController.signin);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

router.post('/forgot', authController.forgot);

router.all('/*', (req, res) => {
	return res.json({ message: 'Invalid route' });
});

export { router as authRouter };
