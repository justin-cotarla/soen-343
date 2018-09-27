import express from 'express';
import { accountRouter } from './AccountRoutes';

const router = express.Router();

router.use('/accounts', accountRouter);

export { router };
