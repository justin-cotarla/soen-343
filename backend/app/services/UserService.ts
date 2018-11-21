import { authenticate, generateToken, register } from '../utility/AuthUtil';
import { Administrator, Client, User } from '../models';
import UserTDG from '../persistence/UserTDG';

class UserService {
    async login(email: string, password: string) {
        const user = await authenticate(email, password);
        const isAdmin = user instanceof Administrator;
        return await generateToken({ user, isAdmin });
    }

    async logout(user: User) {
        if (!user) {
            throw new Error('Undefined user');
        }
        await UserTDG.update(new User(
            user.id,
            user.firstName,
            user.lastName,
            user.phone,
            user.email,
            user.address,
            null,
        ));
    }

    async register(
        firstName: string,
        lastName: string,
        address: string,
        email: string,
        phone: number,
        password: string,
        isAdmin: boolean,
    ) {
        if (
            !firstName ||
            !lastName ||
            !address ||
            !email ||
            !phone ||
            !password
            ) {
            throw new Error('Invalid parameters');
        }
        let user : User;
        if (isAdmin) {
            user = new Administrator('', firstName, lastName, phone, email, address, '');
        } else {
            user = new Client('', firstName, lastName, phone, email, address, '');
        }

        return await register(user, password);
    }

    async getUsers(active: boolean) {
        return await UserTDG.findAll(active);
    }

    async getUser(id: string) {
        return await UserTDG.find(id);
    }
}

export default new UserService();
