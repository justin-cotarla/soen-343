import express, { Request, Response } from 'express';
import TransactionService from '../services/TransactionService';
import { Administrator } from '../models';

const cartController = express.Router();

// precondition(s):
//     - the user initiating the request is a Client
//     - the id of the user initiating the request matches
//       the id corresponding to the requested cart
//     - a cart corresponding to the id exists
// postcondition(s):
//     - the cart corresponding to the id is returned
//     - cart items === @pre cart items
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
