import { TableDataGateway } from './TableDataGateway';
import { User, Administrator, Client } from '../models';
import { register } from '../utility/AuthUtil';
import DatabaseUtil from '../utility/DatabaseUtil';

interface NewUser {
    user: User;
    password: string;
}

class UserTDG implements TableDataGateway {
    async find(id: string): Promise<User> {
        try {
            const query = `
                SELECT
                *
                FROM USER
                WHERE ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }
            const user = data.rows[0];
            if (user.ADMIN === 1) {
                return new Administrator(
                    user.ID,
                    user.FIRST_NAME,
                    user.LAST_NAME,
                    user.PHONE_NUMBER,
                    user.EMAIL,
                    user.ADDRESS,
                    user.SESSION_ID,
                );
            }
            return new Client(
                user.ID,
                user.FIRST_NAME,
                user.LAST_NAME,
                user.PHONE_NUMBER,
                user.EMAIL,
                user.ADDRESS,
                user.SESSION_ID,
            );
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async findAll(active: boolean): Promise<User[]> {
        try {
            const query = `
                SELECT
                *
                FROM USER
                WHERE ${active ? 'SESSION_ID<>""' : 'TRUE'}
            `;

            const data = await DatabaseUtil.sendQuery(query);
            if (!data.rows.length) {
                return [];
            }
            return data.rows.map((user: any) => {
                if (user.ADMIN) {
                    return new Administrator(
                        user.ID,
                        user.FIRST_NAME,
                        user.LAST_NAME,
                        user.PHONE_NUMBER,
                        user.EMAIL,
                        user.ADDRESS,
                        user.SESSION_ID,
                    );
                }
                return new User(
                    user.ID,
                    user.FIRST_NAME,
                    user.LAST_NAME,
                    user.PHONE_NUMBER,
                    user.EMAIL,
                    user.ADDRESS,
                    user.SESSION_ID,
                );
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async insert(item: NewUser): Promise<boolean> {
        try {
            const registeredUser = await register(item.user, item.password);
            if (!registeredUser) {
                return false;
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    async update(user: User): Promise<void> {
        const query = `
            UPDATE
            USER
            SET
                FIRST_NAME=?,
                LAST_NAME=?,
                PHONE_NUMBER=?,
                EMAIL=?,
                ADDRESS=?,
                SESSION_ID=?
            WHERE ID=?
        `;

        await DatabaseUtil.sendQuery(query, [
            user.firstName,
            user.lastName,
            user.phone.toString(),
            user.email,
            user.address,
            user.sessionId,
            user.id,
        ]);
    }
    async delete(id:string): Promise<void> {
        const foundUser = await this.find(id);
        if (foundUser) {
            try {
                const query = `
                    DELETE
                    FROM USER
                    WHERE ID = ?
                `;
                await DatabaseUtil.sendQuery(query, [id]);
            } catch (err) {
                console.log(err);
            }
        }
        return null;
    }
}

export default new UserTDG();
