import express, { Request, Response } from 'express';

import UserService from '../services/UserService';
import TransactionService from '../services/TransactionService';
import { Administrator } from '../models';

declare global {
    namespace Express {
        export interface Request {
            user?: import('../models/User').User;
        }
    }
}

const userController = express.Router();

userController.put('/', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const {
        firstName,
        lastName,
        address,
        phone,
        email,
        password,
        isAdmin,
    } = req.body;

    if (!email || !password || !firstName || !lastName || !address || !phone || isAdmin === null) {
        return res.status(400).end();
    }
    try {
        const registeredUser = await UserService.register(
            firstName,
            lastName,
            address,
            email,
            phone,
            password,
            isAdmin,
        );
        return res.status(200).json({ registeredUser });
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

userController.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).end();
    }

    try {
        const token = await UserService.login(email, password);
        return res.status(200).json({ token });
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

userController.get('/', async (req: Request, res: Response) => {
    if (!req.user || !(req.user instanceof Administrator)) {
        return res.status(403).end();
    }

    const { active } = req.query;

    try {
        const users = await UserService.getUsers(active);
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

userController.post('/logout', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    try {
        await UserService.logout(req.user);

        return res.status(200).end();
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

userController.get('/:id/loans', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).end();
    }

    if (req.user instanceof Administrator) {
        return res.status(405).end();
    }

    const { id } = req.params;
    // tslint:disable-next-line:triple-equals
    if (req.user.id != id) {
        return res.status(403).end();
    }

    try {
        const loans = await TransactionService.viewLoans(req.user.id);
        return res.status(200).json({ loans });
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

export { userController };
