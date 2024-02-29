import express, { Request, Response, Router } from 'express';
import { sysAdminController } from '../Controllers/sysAdminController';
import { sysAdminTokenMiddleware } from '../Middlewares/tokenMiddleware';

const router: Router = express.Router({ mergeParams: true });

router.all('/', (req: Request, res: Response) => {
	res.status(200).json({ message: 'API is running.' });
});

router.post('/authenticate', sysAdminController.authenticate);

router.post('/update-username', sysAdminTokenMiddleware, sysAdminController.updateUsername);

router.post('/update-password', sysAdminTokenMiddleware, sysAdminController.updatePassword);

router.post('/logout', sysAdminController.logout);

export { router as sysAdminRouter };
