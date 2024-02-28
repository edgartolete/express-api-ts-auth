/** this route will allow users to authenticate users */

import express, { Router } from 'express';
import { authController } from '../Controllers/authController';

const router: Router = express.Router({ mergeParams: true });

router.post('/signup', authController.signup);

router.post('/signin', authController.signin);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

router.post('/forgot', authController.forgot);

export { router as authRouter };
