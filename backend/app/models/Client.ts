class Client {
	public firstName: string;
	public lastName: string;
	public phone: int;
	public email: string;
	public address: string;
	
	constructor (firstName: string, lastName: string, phone: int, email: string, address:string){
		this.firstName = firstName
		this.lastName = lastName;
		this.phone=phone;
		this.email = email;
		this.address = address;
    }
}
export {Client};

