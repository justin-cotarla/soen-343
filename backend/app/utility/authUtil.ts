import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

const register = async (client: any): Promise<any> => {
    const userQuery = '';
    const registerQuery = '';

    // Check if user exists
    // let result = await databaseUtil.sendQuery(userQuery);

    const hash = await bcrypt.hash(client.password, SALT_ROUNDS);
    // result = await databaseUtil.sendQuery(registerQuery);

    // return newly created client
    return {
        name: '',
    };
};

const authenticate = async (email: string, password: string): Promise<any> => {
    const query = '';

    // Check if user exists
    // const result = await databaseUtil.sendQuery(query);

    const match = true; // await bcrypt.compare(password, result.rows[0].HASH);
    if (match) {
        // return the authenticated user
        return {

        };
    }
    // otherwise, return authentication error

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
