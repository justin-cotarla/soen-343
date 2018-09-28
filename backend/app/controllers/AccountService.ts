import { Request, Response } from 'express';
import { authenticate, generateToken, register } from '../utility/AuthUtil';
import { Client } from '../models/Client';
import { Administrator } from '../models/Administrator';
import DatabaseUtil from '../utility/DatabaseUtil';

class AccountService {

    async login(request: Request, response: Response) {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(401).end();
        }

        try {
            const authUser = await authenticate(email, password);
            const isAdmin = (authUser instanceof Administrator);
            const token = await generateToken({ authUser, isAdmin });
            return response.status(200).json({ token });
        } catch (err) {
            console.log(`error: ${err}`);
            return response.status(400).end();
        }
    }

    async createAccount(request: Request, response: Response) {
        const { user } = request;

        if (!(user instanceof Administrator)) {
            return response.status(401).end();
        }

        const {
            firstName,
            lastName,
            address,
            phone,
            email,
            password,
            isAdmin,
        } = request.body;

        if (!email || !password || !firstName || !lastName || !address || !phone || !isAdmin) {
            return response.status(400).end();
        }

        let client : Client;
        if (isAdmin) {
            client = new Administrator(firstName, lastName, phone, email, address);
        } else {
            client = new Client(firstName, lastName, phone, email, address);
        }

        try {
            const registeredUser = await register(client, password);
            return response.status(200).json({ registeredUser });
        } catch (err) {
            console.log(`error: ${err}`);
            return response.status(400).end();
        }
    }

    async getUsers(request: Request, response: Response) {
        const active = request.query.active || false;
        try {
            const query = active === 'true' ?
            'SELECT * FROM ACCOUNT WHERE LOGGED_IN=1' : 'SELECT * FROM ACCOUNT';
            const data = await DatabaseUtil.sendQuery(query);
            const users = data.rows.map(user =>
                new Client(
                    user.FIRST_NAME,
                    user.LAST_NAME,
                    user.PHONE_NUMBER,
                    user.EMAIL,
                    user.ADDRESS,
                ));
            return response.status(200).json(users);
        } catch (err) {
            console.log(`error: ${err}`);
            return response.status(400).end();
        }
    }
}

export default new AccountService();
