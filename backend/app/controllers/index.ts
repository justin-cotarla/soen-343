import express from 'express';
import { userController } from './UserController';
import { catalogController } from './CatalogController';

const router = express.Router();

router.use('/users', userController);
router.use('/catalog', catalogController);

export { router };
