import { Request, Response } from 'express';
import { authenticate, generateToken } from '../utility/authUtil';

class AccountService {

    async login(request: Request, response: Response) {
        
        if (!request.get('Authorization')) {
            response.status(400);
            return;
        }

        const credentials = atob(request.get('Authorization')).split(':');
        const email = credentials[0];
        const password = credentials[1];

        if (!email) {
            response.status(400);
            return;
        }
        if (!password) {
            response.status(400);
            return;
        }
        
        try {
            const authUser = await authenticate(email, password);
            const token = await generateToken(authUser);
            response.status(200).json({ token });
        } catch (err) {
            console.log('error: ' + err);
            response.status(400);
        }
    }

}

export default new AccountService();


