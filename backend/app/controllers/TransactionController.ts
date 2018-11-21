import express, { Request, Response } from 'express';
import { Administrator, User } from '../models';
import { OperationType } from '../models/Transaction';
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
        return res.status(403).end();
    }

    const { operation }: { operation: string } = req.body;

    if (!operation) {
        return res.status(400).end();
    }

    try {
        switch (operation.toUpperCase()) {
        case OperationType.LOAN:
            await TransactionService.borrowItems(req.user.id);
            break;
        case OperationType.RETURN:
            const { inventoryItemId } : { inventoryItemId: number } = req.body;
            await TransactionService.returnItem(req.user.id, inventoryItemId);
            break;
        default:
            return res.status(400).end();
        }

        return res.status(200).send('success');
    } catch (error) {
        return res.status(400).send('fail');
    }
});

export { transactionController };
