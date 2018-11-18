import express from 'express';
import { userController } from './UserController';
import { catalogController } from './CatalogController';
import { cartController } from './CartController';
import { transactionController } from './TransactionController';

const router = express.Router();

router.use('/users', userController);
router.use('/catalog', catalogController);
router.use('/cart', cartController);
router.use('/transactions', transactionController);

export { router };
