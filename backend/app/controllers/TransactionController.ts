import express, { Request, Response } from 'express';
import { Administrator } from '../models';
import { OperationType, Transaction } from '../models/Transaction';
import TransactionService from '../services/TransactionService';

const transactionController = express.Router();

// @requires(
//     req.user instanceof Administrator
// )
transactionController.get('/', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }
    const {
        query,
        order,
        direction,
        timestamp,
        operation,
    } = req.query;

    try {
        const transactions = await TransactionService.viewTransactions(
            query,
            order,
            direction,
            timestamp,
            operation,
        );
        return res.status(200).json(transactions);
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

// @requires(
//     req.user instanceof Client,
//     req.user.id === req.params.id,
//     TransactionService.carts.has(req.user.id) === true
// )
// @ensures(
//     TransactionService.carts.has(req.user.id) === false,
//     TransactionService.carts.size() === $old(TransactionService.carts.size()) - 1
// )
transactionController.delete('/:id', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    if (req.user instanceof Administrator) {
        return res.status(403).end();
    }

    const userId = req.params.id;
    const cancelled = await TransactionService.cancelTransaction(userId);

    if (cancelled) {
        return res.status(200).end();
    }
    return res.status(400).end();

});

export { transactionController };
