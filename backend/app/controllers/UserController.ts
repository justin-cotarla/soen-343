import express, { Request, Response } from 'express';

import UserService from '../services/UserService';

const userController = express.Router();

userController.post('/', UserService.createAccount);

userController.post('/login', UserService.login);

userController.get('/', UserService.getActiveUsers);

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
