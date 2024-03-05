import express, { Router } from 'express';
import { rolesController } from '../Controllers/rolesController';

const router: Router = express.Router({ mergeParams: true });

router.get('/find', rolesController.all);

router.post('/create', rolesController.create);

router.patch('/update/', rolesController.update);

router.delete('/delete/', rolesController.delete);

export { router as rolesRouter };
