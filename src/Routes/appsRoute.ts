/**
 * Route where super admin can create, and delete app codes that will also generate and regenerate api keys.
 * So developers have to request to an api with URI of app code and headers of api key.
 * */

import express, { Router } from 'express';
import { appsController } from '../Controllers/appsController';

const router: Router = express.Router({ mergeParams: true });

router.get('/find/', appsController.find);

router.post('/create/', appsController.create);

router.patch('/update/', appsController.update);

router.patch('/regenerate/', appsController.regenerate);

router.delete('/delete/', appsController.delete);

export { router as appsRouter };
