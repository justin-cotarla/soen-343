import express from 'express';
import { userController } from './UserController';
import { catalogController } from './CatalogController';
import { cartController } from './CartController';

const router = express.Router();

router.use('/users', userController);
router.use('/catalog', catalogController);
router.use('/cart', cartController);

export { router };
