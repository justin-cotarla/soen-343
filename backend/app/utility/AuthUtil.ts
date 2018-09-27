import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import DatabaseUtil from './DatabaseUtil';

// TEMPORARY: REMOVE AFTER MAKING CLASSES FOR CLIENT AND ADMIN
interface Client {
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
    address: string;
}

const SALT_ROUNDS = 10;

const register = async (client: Client, password: string): Promise<Client> => {
    const userQuery = 'SELECT ID FROM ACCOUNT WHERE EMAIL=?;';
    const registerQuery = `
        INSERT INTO ACCOUNT
        (EMAIL, FIRST_NAME, LAST_NAME, ADDRESS, PHONE_NUMBER, HASH, ADMIN)
        VALUES
        (?, ?, ?, ?, ?, ?, ?);
        `;

    const adminAccount = '0'; // client instanceof Administrator ? 1 : 0;

    try {
        let result = await DatabaseUtil.sendQuery(userQuery, [client.email]);
        if (result.rows.length !== 0) {
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
            adminAccount,
        ]);
        return client;

    } catch (err) {
        console.log(err);
        throw err;
    }
};

const authenticate = async (email: string, password: string): Promise<Client> => {
    const query = `SELECT
        EMAIL, FIRST_NAME, LAST_NAME, PHONE_NUMBER, ADDRESS, HASH, ADMIN
        FROM ACCOUNT
        WHERE EMAIL=?;`;

    try {
        const result = await DatabaseUtil.sendQuery(query, [email]);
        if (result.rows.length === 0) {
            throw new Error('User does not exist');
        }

        const match = await bcrypt.compare(password, result.rows[0].HASH);

        if (match) {
            return {
                email: result.rows[0].EMAIL,
                firstName: result.rows[0].FIRST_NAME,
                lastName: result.rows[0].LAST_NAME,
                address: result.rows[0].ADDRESS,
                phone: result.rows[0].PHONE_NUMBER,
            };
        }

        throw new Error('Incorrect email or password');
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
