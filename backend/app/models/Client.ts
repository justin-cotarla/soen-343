import { User } from './User';

class Client extends User {
    constructor(
        firstName: string,
        lastName: string,
        phone: number,
        email: string,
        address: string) {
        super(firstName, lastName, phone, email, address);
    }
}

export { Client };
