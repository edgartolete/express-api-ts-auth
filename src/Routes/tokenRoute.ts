import express, { Router } from 'express';
import { tokensController } from '../Controllers/tokensController';

const router: Router = express.Router();

router.post('/refresh', tokensController.refresh);

export { router as tokenRouter };
