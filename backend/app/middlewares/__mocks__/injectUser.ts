import * as jwt from 'jsonwebtoken';
import { Client, Administrator } from '../../models';

const injectUser = async (req: any, res: any, next: Function) => {
    const header: string = req.get('Authorization');

    if (header) {
        const token = header.split(' ')[1];
        const { user, isAdmin }: any = jwt.decode(token);

        if (isAdmin) {
            req.user = new Administrator(
                user.id,
                user.firstName,
                user.lastName,
                user.phone,
                user.email,
                user.address,
                user.sessionId,
            );
        } else {
            req.user = new Client(
                user.id,
                user.firstName,
                user.lastName,
                user.phone,
                user.email,
                user.address,
                user.sessionId,
            );
        }
    }
    next();
};

export default injectUser;
