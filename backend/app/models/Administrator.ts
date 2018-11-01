import { User } from './User';

class Administrator extends User {
    constructor (
        id: string,
        firstName: string,
        lastName: string,
        phone: number,
        email: string,
        address: string,
        sessionId: string,
    ) {
        super(id, firstName, lastName, phone, email, address, sessionId);
    }
}

export { Administrator };
