import express from 'express';
import { router as AccountRouter } from './AccountRoutes';

const router = express.Router();

router.use('/accounts', AccountRouter);

export { router };
