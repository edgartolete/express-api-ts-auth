import express, { Request, Response, Router } from 'express';
import { sysAdminController } from '../Controllers/sysAdminController';

const router: Router = express.Router({ mergeParams: true });

router.all('/', (req: Request, res: Response) => {
	res.status(200).json({ message: 'API is running.' });
});

router.post('/authenticate', sysAdminController.authenticate);

router.post('/update-username', sysAdminController.updateUsername);

router.post('/update-password', sysAdminController.updatePassword);

export { router as sysAdminRouter };
