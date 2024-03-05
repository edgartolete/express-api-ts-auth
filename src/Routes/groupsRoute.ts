import express, { Router } from 'express';
import { groupsController } from '../Controllers/groupsController';

const router: Router = express.Router({ mergeParams: true });

router.get('/find/', groupsController.find);

router.post('/create/', groupsController.update);

router.patch('/update/', groupsController.update);

router.delete('/delete/', groupsController.delete);

export { router as groupsRouter };
