import express, { Router } from 'express';
import { rolesController } from '../Controllers/rolesController';

const router: Router = express.Router({ mergeParams: true });

router.get('/', rolesController.all);

router.get('/:id', rolesController.find);

router.patch('/create', rolesController.create);

router.patch('/update/:id', rolesController.update);

router.delete('/delete/:id', rolesController.delete);

export { router as rolesRouter };
