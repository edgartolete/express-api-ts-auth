import express, { Router } from 'express';
import { groupsController } from '../Controllers/groupsController';

const router: Router = express.Router({ mergeParams: true });

router.get('/', groupsController.all);

router.get('/:id', groupsController.find);

router.patch('/create', groupsController.update);

router.patch('/update/:id', groupsController.update);

router.delete('/delete/:id', groupsController.delete);

export { router as groupsRouter };
