import express, { Request, Response, Router } from 'express';
import { sysAdminController } from '../Controllers/sysAdminController';
import { sysAdminTokenMiddleware } from '../Middlewares/tokenMiddleware';

const router: Router = express.Router({ mergeParams: true });

router.all('/ping', (req: Request, res: Response) => {
	res.status(200).json({ message: 'pong' });
});

router.post('/authenticate', sysAdminController.authenticate);

router.patch('/update-username', sysAdminTokenMiddleware, sysAdminController.updateUsername);

router.patch('/update-password', sysAdminTokenMiddleware, sysAdminController.updatePassword);

router.post('/logout', sysAdminController.logout);

export { router as sysAdminRouter };
