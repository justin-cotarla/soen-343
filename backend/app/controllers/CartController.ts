import express, { Request, Response } from 'express';
import TransactionService from '../services/TransactionService';
import { Administrator } from '../models';

const cartController = express.Router();

// @requires({
//     req.user instanceof Client,
//     req.user.id === req.params.id,
//     TransactionService.viewCart(req.params.id) !== null,
// })
cartController.get('/:id', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    if (req.user instanceof Administrator) {
        return res.status(403).end();
    }

    const { id } = req.params;
    // tslint:disable-next-line:triple-equals
    if (req.user.id != id) {
        return res.status(403).end();
    }

    try {
        const cart = await TransactionService.viewCart(id);
        return res.status(200).json({ cart });
    } catch (error) {
        return res.status(400).end();
    }
});

export { cartController };
