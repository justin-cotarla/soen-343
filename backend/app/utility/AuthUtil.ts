import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import v4 from 'uuid/v4';

import DatabaseUtil from './DatabaseUtil';
import { User, Client, Administrator } from '../models';

const SALT_ROUNDS = 10;

const register = async (user: User, password: string): Promise<User> => {
    const userQuery = `
        SELECT
        ID
        FROM USER
        WHERE EMAIL=?;
    `;
    const registerQuery = `
        INSERT INTO USER
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
        FROM USER
        WHERE EMAIL=?;
    `;

    const result = await DatabaseUtil.sendQuery(query, [email]);
    if (!result.rows.length) {
        throw new Error('User does not exist');
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.HASH);

    if (!match) {
        throw new Error('Incorrect email or password');
    }

    const sessionId = v4();

    const setLoggedInQuery = `
        UPDATE
        USER
        SET
        SESSION_ID=?,
        LAST_LOGIN=CURRENT_TIMESTAMP
        WHERE ID=?;
    `;
    await DatabaseUtil.sendQuery(setLoggedInQuery, [sessionId, user.ID]);

    if (user.ADMIN === 1) {
        return new Administrator(
            user.ID,
            user.FIRST_NAME,
            user.LAST_NAME,
            user.PHONE_NUMBER,
            user.EMAIL,
            user.ADDRESS,
            sessionId,
        );
    }
    return new Client(
        user.ID,
        user.FIRST_NAME,
        user.LAST_NAME,
        user.PHONE_NUMBER,
        user.EMAIL,
        user.ADDRESS,
        sessionId,
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

export {
    register,
    authenticate,
    generateToken,
    validateToken,
};
