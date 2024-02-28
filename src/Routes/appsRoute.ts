/**
 * Route where super admin can create, and delete app codes that will also generate and regenerate api keys.
 * So developers have to request to an api with URI of app code and headers of api key.
 * */

import express, { Router } from 'express';
import { appsController } from '../Controllers/appsController';

const router: Router = express.Router({ mergeParams: true });

router.get('/', appsController.all);

router.get('/:app', appsController.find);

router.post('/create/', appsController.create);

router.patch('/update/:app', appsController.update);

router.post('/regenerate/:app', appsController.regenerate);

router.delete('/delete/:app', appsController.delete);

export { router as appsRouter };
