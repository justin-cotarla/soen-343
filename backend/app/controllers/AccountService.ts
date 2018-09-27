import { Request, Response } from 'express';
import { authenticate, generateToken, register } from '../utility/AuthUtil';
import { Client } from '../models/Client';
import { Administrator } from '../models/Administrator';

class AccountService {

    async login(request: Request, response: Response) {

        if (!request.get('Authorization')) {
            response.status(400).send('Missing Authorization');
            return;
        }

        const credentials = (Buffer.from(request.get('Authorization').split(' ')[1], 'base64')
            .toString('utf8'))
            .split(':');
        const email = credentials[0];
        const password = credentials[1];

        if (!email || !password) {
            response.status(400).send('Incomplete form');
            return;
        }

        try {
            const authUser = await authenticate(email, password);
            let isAdmin = false;
            if (authUser instanceof Administrator) {
                isAdmin = true;
            }
            const token = await generateToken({ authUser, isAdmin });
            return response.status(200).json({ token });
        } catch (err) {
            console.log(`error: ${err}`);
            response.status(400).send('Unknown Error');
        }
    }

    async createAccount(request: Request, response: Response) {
        const { firstName, lastName, address, phone, email, password, isAdmin } = request.body;

        if (!email || !password || !firstName || !lastName || !address || !phone || !isAdmin) {
            response.status(400).send('Missing information');
            return;
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
            response.status(200).json({ token });
        } catch (err) {
            console.log(`error: ${err}`);
            response.status(400).send('Unknown Error');
        }
    }

}

export default new AccountService();
