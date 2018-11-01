import { Request, Response } from 'express';

import { authenticate, generateToken, register } from '../utility/AuthUtil';
import { Administrator, Client, User } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';
import UserTDG from '../persistence/UserTDG';

class UserService {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).end();
        }

        try {
            const user = await authenticate(email, password);
            const isAdmin = user instanceof Administrator;
            const token = await generateToken({ user, isAdmin });
            return res.status(200).json({ token });
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }
    }

    async logout(user: User) {
        await UserTDG.update(new User(
            user.id,
            user.firstName,
            user.lastName,
            user.phone,
            user.email,
            user.address,
            null,
        ));
    }

    async createAccount(req: Request, res: Response) {
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

        let user : User;
        if (isAdmin) {
            user = new Administrator('', firstName, lastName, phone, email, address, '');
        } else {
            user = new Client('', firstName, lastName, phone, email, address, '');
        }

        try {
            const registeredUser = await register(user, password);
            return res.status(200).json({ registeredUser });
        } catch (err) {
            console.log(err);
            return res.status(400).end();
        }
    }

    async getActiveUsers(req: Request, res: Response) {
        if (!req.user || !(req.user instanceof Administrator)) {
            return res.status(403).end();
        }

        try {
            const query = `
                SELECT
                *
                FROM USER
                WHERE ${req.query.active ? 'SESSION_ID<>""' : 'TRUE'}
            `;

            const data = await DatabaseUtil.sendQuery(query);
            const users = data.rows.map((user: any) =>
                new User(
                    user.ID,
                    user.FIRST_NAME,
                    user.LAST_NAME,
                    user.PHONE_NUMBER,
                    user.EMAIL,
                    user.ADDRESS,
                    user.SESSION_ID,
                ));
            return res.status(200).json(users);
        } catch (err) {
            console.log(err);
            return res.status(400).end();
        }
    }
}

export default new UserService();
