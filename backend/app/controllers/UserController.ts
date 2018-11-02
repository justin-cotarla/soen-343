import express, { Request, Response } from 'express';

import UserService from '../services/UserService';
import { Administrator } from '../models';

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

    if (!email || !password || !firstName || !lastName || !address || !phone || !isAdmin) {
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
        return res.status(401).end();
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

    try {
        const users = await UserService.getActiveUsers();
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

userController.post('/logout', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(403).end();
    }

    try {
        await UserService.logout(req.user);

        return res.status(200).end();
    } catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

export { userController };
