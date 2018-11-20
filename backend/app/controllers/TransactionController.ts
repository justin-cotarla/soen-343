import express, { Request, Response } from 'express';
import { Administrator } from '../models';
import TransactionService from '../services/TransactionService';

const transactionController = express.Router();

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
