import { Request, Response } from 'express';
import { authenticate, generateToken, register } from '../utility/AuthUtil';
import { Administrator, Client, User } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';

class AccountService {

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).end();
        }

        try {
            const profile = await authenticate(email, password);
            const isAdmin = profile instanceof Administrator;
            const token = await generateToken({ profile, isAdmin });
            return res.status(200).json({ token });
        } catch (err) {
            console.log(`error: ${err}`);
            if (err.message === 'User already logged in') {
                return res.status(444).end();
            }
            return res.status(400).end();
        }
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
            user = new Administrator(firstName, lastName, phone, email, address);
        } else {
            user = new Client(firstName, lastName, phone, email, address);
        }

        try {
            const registeredUser = await register(user, password);
            return res.status(200).json({ registeredUser });
        } catch (err) {
            console.log(`error: ${err}`);
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
                FROM ACCOUNT
                WHERE ${req.query.active ? 'LOGGED_IN=1' : 'TRUE'}
            `;

            const data = await DatabaseUtil.sendQuery(query);
            const users = data.rows.map(user =>
                new User(
                    user.FIRST_NAME,
                    user.LAST_NAME,
                    user.PHONE_NUMBER,
                    user.EMAIL,
                    user.ADDRESS,
                ));
            return res.status(200).json(users);
        } catch (err) {
            console.log(`error: ${err}`);
            return res.status(400).end();
        }
    }
}

export default new AccountService();