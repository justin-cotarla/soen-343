import { Request, Response } from 'express';
import { authenticate, generateToken } from '../utility/AuthUtil';

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

        if (!email) {
            response.status(400).send('Missing Email');
            return;
        }
        if (!password) {
            response.status(400).send('Missing Password');
            return;
        }

        try {
            const authUser = await authenticate(email, password);
            const token = await generateToken(authUser);
            response.status(200).json({ token });
        } catch (err) {
            console.log(`error: ${err}`);
            response.status(400).send('Unknown Error');
        }
    }

}

export default new AccountService();
