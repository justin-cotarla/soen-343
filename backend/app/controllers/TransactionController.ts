import express, { Request, Response } from 'express';
import { Administrator } from '../models';
import { OperationType } from '../models/Transaction';
import TransactionService from '../services/TransactionService';

declare global {
    namespace Express {
        export interface Request {
            user?: import('../models/User').User;
        }
    }
}

const transactionController = express.Router();

// @requires(
//     req.user instanceof Administrator
// )
transactionController.get('/', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    if (!(req.user instanceof Administrator)) {
        return res.status(405).end();
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

// @requires({
//     req.user !== null && req.user instanceof Client,
//     req.body.operation.toUpperCase() === 'LOAN'
//        || req.body.operation.toUpperCase() === 'RETURN',
//     req.body.operation.toUpperCase() === 'RETURN' implies inventoryItemId !== null,
// })
transactionController.put('/', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    if (req.user instanceof Administrator) {
        return res.status(405).end();
    }

    const {
        operation,
        inventoryItemId,
    }: { operation: string, inventoryItemId: number } = req.body;

    if (
        (!operation) ||
        (operation.toLowerCase() === 'return' && !inventoryItemId)
    ) {
        return res.status(400).end();
    }

    try {
        switch (operation.toUpperCase()) {
        case OperationType.LOAN:
            await TransactionService.borrowItems(req.user.id);
            break;
        case OperationType.RETURN:
            await TransactionService.returnItem(req.user.id, inventoryItemId);
            break;
        default:
            return res.status(400).end();
        }

        return res.status(200).end();
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ error: error.message });
    }
});

export { transactionController };
