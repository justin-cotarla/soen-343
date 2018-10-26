import express from 'express';
import { accountRouter } from './AccountController';
import  { catalogRouter } from './CatalogController';

const router = express.Router();

router.use('/accounts', accountRouter);
router.use('/catalog', catalogRouter);

export { router };
