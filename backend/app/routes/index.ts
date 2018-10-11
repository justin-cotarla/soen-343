import express from 'express';
import { accountRouter } from './AccountRoutes';
import  { catalogRouter } from './CatalogRoutes';

const router = express.Router();

router.use('/accounts', accountRouter);
router.use('/catalog', catalogRouter);

export { router };
