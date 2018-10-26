import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import DatabaseUtil from './DatabaseUtil';
import { User, Client } from '../models';
import { Administrator } from '../models/Administrator';

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

const SALT_ROUNDS = 10;

const register = async (user: User, password: string): Promise<User> => {
    const userQuery = `
        SELECT
        ID
        FROM ACCOUNT
        WHERE EMAIL=?;
    `;
    const registerQuery = `
        INSERT INTO ACCOUNT
        (EMAIL, FIRST_NAME, LAST_NAME, ADDRESS, PHONE_NUMBER, HASH, ADMIN)
        VALUES
        (?, ?, ?, ?, ?, ?, ?);
    `;

    const isAdminAccount = user instanceof Administrator ? '1' : '0';

    let result = await DatabaseUtil.sendQuery(userQuery, [user.email]);
    if (result.rows.length) {
        throw new Error('User already exists');
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    result = await DatabaseUtil.sendQuery(registerQuery, [
        user.email,
        user.firstName,
        user.lastName,
        user.address,
        user.phone.toString(),
        hash,
        isAdminAccount,
    ]);
    return user;
};

const authenticate = async (email: string, password: string): Promise<User> => {
    const query = `
        SELECT
        *
        FROM ACCOUNT
        WHERE EMAIL=?;
    `;

    const result = await DatabaseUtil.sendQuery(query, [email]);
    if (!result.rows.length) {
        throw new Error('User does not exist');
    }

    const user = result.rows[0];
    if (user.LOGGED_IN === 1) {
        throw new Error('User already logged in');
    }

    const match = await bcrypt.compare(password, user.HASH);

    if (!match) {
        throw new Error('Incorrect email or password');
    }

    const setLoggedInQuery = 'UPDATE ACCOUNT SET LOGGED_IN=? WHERE ID=?;';
    await DatabaseUtil.sendQuery(setLoggedInQuery, ['1', user.ID]);

    if (user.ADMIN === 1) {
        return new Administrator(
            user.FIRST_NAME,
            user.LAST_NAME,
            user.PHONE_NUMBER,
            user.EMAIL,
            user.ADDRESS,
        );
    }
    return new Client(
        user.FIRST_NAME,
        user.LAST_NAME,
        user.PHONE_NUMBER,
        user.EMAIL,
        user.ADDRESS,
    );
};

const generateToken = (payload: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_KEY,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                return resolve(token);
            });
    });
};

const validateToken = (token: string): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_KEY,
            (err, decoded) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(decoded);
            });
    });
};

const injectUser = async (req: Request, res: Response, next: NextFunction) => {
    const header: string = req.get('Authorization');

    if (header) {
        try {
            const token = header.split(' ')[1];
            const { profile, isAdmin }: any = await validateToken(token);

            if (isAdmin) {
                req.user = new Administrator(
                    profile.firstName,
                    profile.lastName,
                    profile.phone,
                    profile.email,
                    profile.address,
                );
            } else {
                req.user = new Client(
                    profile.firstName,
                    profile.lastName,
                    profile.phone,
                    profile.email,
                    profile.address,
                );
            }
        } catch (err) {
            console.log(err);
            return res.status(401).end();
        }
    }

    next();
};

export {
    register,
    authenticate,
    generateToken,
    validateToken,
    injectUser,
};
