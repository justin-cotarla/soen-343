class User {
    public id: string;
    public firstName: string;
    public lastName: string;
    public phone: number;
    public email: string;
    public address: string;
    public sessionId: string;
    public lastLogin?: Date;

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
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.sessionId = sessionId;
        this.lastLogin = lastLogin;
    }
}
export { User };
