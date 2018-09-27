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
        const { firstName, lastName, address, phone, email, password, isAdmin } = request.body;

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
            const registerUser = await register(client, password);
            const token = await generateToken({ registerUser });
            return response.status(200).json({ token });
        } catch (err) {
            console.log(`error: ${err}`);
            return response.status(400).end();
        }
    }

    async getLoggedInUsers(request: Request, response: Response) {
        const users = await DatabaseUtil.sendQuery('SELECT * FROM ACCOUNT WHERE LOGGED_IN=0');
        return response.send(users);
    }
}

export default new AccountService();
