import { User } from './User';

class Client extends User {
    constructor(
        id: string,
        firstName: string,
        lastName: string,
        phone: number,
        email: string,
        address: string,
        sessionId: string,
        lastLogin?: Date,
    ) {
        super(
            id,
            firstName,
            lastName,
            phone,
            email,
            address,
            sessionId,
            lastLogin,
        );
    }
}

export { Client };
