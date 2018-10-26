import { User } from './User';

class Administrator extends User {
    constructor (
        firstName: string,
        lastName: string,
        phone: number,
        email: string,
        address: string) {
        super(firstName, lastName, phone, email, address);
    }
}

export { Administrator };
