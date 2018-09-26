import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import DatabaseUtil from './DatabaseUtil';

interface AccountResponse {
    id: any;
    email: any;
    name: any;
}

const SALT_ROUNDS = 10;

const register = async (client: any, password: string): Promise<AccountResponse> => {
    const userQuery = 'SELECT ID FROM ACCOUNT WHERE EMAIL=?;';
    const registerQuery = `
        INSERT INTO ACCOUNT
        (EMAIL, FIRST_NAME, LAST_NAME, ADDRESS, PHONE_NUMBER, HASH, ADMIN)
        VALUES
        (?, ?, ?, ?, ?, ?, ?);
        `;

    const adminAccount = 0; // client instanceof Administrator ? 1 : 0;
    // Check if user exists
    try {
        let result = await DatabaseUtil.sendQuery(userQuery, [client.email]);
        if (result.rows.length !== 0) {
            throw new Error('User already exists.');
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        result = await DatabaseUtil.sendQuery(registerQuery, [
            client.email,
            client.firstName,
            client.lastName,
            client.address,
            client.phoneNumber,
            hash,
            adminAccount,
        ]);

        // return newly created client???
        return {
            id: result.rows.insertId,
            email: client.email,
            name: `${client.firstName} ${client.lastName}`,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const authenticate = async (email: string, password: string): Promise<AccountResponse> => {
    const query = `SELECT
        ID, EMAIL, FIRST_NAME, LAST_NAME, HASH
        FROM ACCOUNT
        WHERE EMAIL=?;`;

    // Check if user exists
    try {
        const result = await DatabaseUtil.sendQuery(query, [email]);
        if (result.rows.length === 0) {
            throw new Error('User does not exist.');
        }

        const match = await bcrypt.compare(password, result.rows[0].HASH);

        if (match) {
            // return the authenticated user
            return {
                id: result.rows[0].ID,
                email: result.rows[0].EMAIL,
                name: `${result.rows[0].FIRST_NAME} ${result.rows[0].LAST_NAME}`,
            };
        }
        // otherwise, return authentication error
        throw new Error('Authentication error.');
    } catch (err) {
        console.log(err);
        throw err;
    }
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
