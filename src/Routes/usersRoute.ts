/** this route will allow users to register, create update delete  */

import express, { Router } from 'express';
import { usersController } from '../Controllers/usersController';

const router: Router = express.Router({ mergeParams: true });

router.get('/', usersController.all);

router.get('/:id', usersController.find);

router.patch('/create', usersController.create);

router.patch('/update/:id', usersController.update);

router.delete('/delete/:id', usersController.update);

export { router as usersRouter };
