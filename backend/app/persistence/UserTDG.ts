import { TableDataGateway } from './TableDataGateway';
import { User } from '../models';
import { register } from '../utility/AuthUtil';
import DatabaseUtil from '../utility/DatabaseUtil';

interface NewUser {
    user: User;
    password: string;
}

class UserTDG implements TableDataGateway {

    find = async(id: string): Promise<User> => {
        try {
            const query = `
                SELECT
                *
                FROM ACCOUNT
                WHERE ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }
            const users = data.rows.map(user =>
                new User(
                    user.FIRST_NAME,
                    user.LAST_NAME,
                    user.PHONE_NUMBER,
                    user.EMAIL,
                    user.ADDRESS,
                ));
            return users[0];
        } catch (err) {
            console.log(`error: ${err}`);
            return null;
        }
    } // User
    insert = async(item: NewUser): Promise<boolean> => {
        try {
            const registeredUser = await register(item.user, item.password);
            if (!registeredUser) {
                return false;
            }
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return false;
        }
    }
    update = async (item: User): Promise<boolean> => {
        try {
            const query = `
                UPDATE
                ACCOUNT
                SET FIRST_NAME = ?,
                LAST_NAME = ?,
                PHONE_NUMBER = ?,
                EMAIL = ?,
                ADDRESS = ?,
                WHERE ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [
                item.firstName,
                item.lastName,
                item.phone.toString(),
                item.email,
                item.address,
                item.id]);
            return true;
        } catch (err) {
            console.log(`error: ${err}`);
            return false;
        }
    }
    delete = async (id:string): Promise<User> => {
        const foundUser = await this.find(id);
        if (foundUser) {
            try {
                const query = `
                    DELETE
                    FROM ACCOUNT
                    WHERE ID = ?
                `;
                await DatabaseUtil.sendQuery(query, [id]);
                return foundUser;
            } catch (err) {
                console.log(`error: ${err}`);
                return null;
            }
        }
        return null;
    }
}
