import {Client} from './Client'
class Administrator extends Client {
	
	constructor (firstName: string, lastName: string, phone: int, email: string, address:string){
		super(firstName, lastName, phone, email, address);
	}
}

export {Administrator};