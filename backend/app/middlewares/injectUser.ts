import { Request, Response, NextFunction } from 'express';

import { User, Client, Administrator } from '../models';
import DatabaseUtil from '../utility/DatabaseUtil';
import { validateToken } from '../utility/AuthUtil';

const injectUser = async (req: Request, res: Response, next: NextFunction) => {
    const header: string = req.get('Authorization');

    if (header) {
        try {
            const token = header.split(' ')[1];
            const { user, isAdmin }: any = await validateToken(token);

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

            if (!(await validateSession(req.user))) {
                return res.status(403).end();
            }
        } catch (err) {
            console.log(err);
            return res.status(401).end();
        }
    }

    next();
};

const validateSession = async (user: User) => {
    const query = `
        SELECT
        *
        FROM
        USER
        WHERE
            ID=?
        AND
            SESSION_ID=?;
    `;

    const result = await DatabaseUtil.sendQuery(query, [user.id, user.sessionId]);
    return (result.rows.length === 1);
};

export default injectUser;
