import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import DatabaseUtil from './DatabaseUtil';
import { Client } from '../models/Client';
import { Administrator } from '../models/Administrator';

const SALT_ROUNDS = 10;

const register = async (client: Client, password: string): Promise<Client> => {
    const userQuery = 'SELECT ID FROM ACCOUNT WHERE EMAIL=?;';
    const registerQuery = `
        INSERT INTO ACCOUNT
        (EMAIL, FIRST_NAME, LAST_NAME, ADDRESS, PHONE_NUMBER, HASH, ADMIN)
        VALUES
        (?, ?, ?, ?, ?, ?, ?);
        `;

    const isAdminAccount = client instanceof Administrator ? '1' : '0';

    let result = await DatabaseUtil.sendQuery(userQuery, [client.email]);
    if (!result.rows.length) {
        throw new Error('User already exists');
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    result = await DatabaseUtil.sendQuery(registerQuery, [
        client.email,
        client.firstName,
        client.lastName,
        client.address,
        client.phone.toString(),
        hash,
        isAdminAccount,
    ]);
    return client;
};

const authenticate = async (email: string, password: string): Promise<Client> => {
    const query = `SELECT
        *
        FROM ACCOUNT
        WHERE EMAIL=?;`;

    const result = await DatabaseUtil.sendQuery(query, [email]);
    if (!result.rows.length) {
        throw new Error('User does not exist');
    }
    if (result.rows[0].LOGGED_IN === '1') {
        throw new Error('User already logged in');
    }

    const match = await bcrypt.compare(password, result.rows[0].HASH);

    if (!match) {
        throw new Error('Incorrect email or password');
    }

    const setLoggedInQuery = 'UPDATE ACCOUNT SET LOGGED_IN=? WHERE ID=?;';
    await DatabaseUtil.sendQuery(setLoggedInQuery, ['1', result.rows[0].ID]);

    if (result.rows[0].ADMIN === '1') {
        return new Administrator(
            result.rows[0].FIRST_NAME,
            result.rows[0].LAST_NAME,
            result.rows[0].PHONE_NUMBER,
            result.rows[0].EMAIL,
            result.rows[0].ADDRESS,
        );
    }
    return new Client(
        result.rows[0].FIRST_NAME,
        result.rows[0].LAST_NAME,
        result.rows[0].PHONE_NUMBER,
        result.rows[0].EMAIL,
        result.rows[0].ADDRESS,
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

const validateToken = (token: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_KEY,
            (err, decoded) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(decoded.toString());
            });
    });
};

export {
    register,
    authenticate,
    generateToken,
    validateToken,
};
