import { UserDocument } from '../schema/user.schema';

export class UserDTO {
	email: string;
	id: string;
	isActivated: boolean;

	constructor(userDoc: UserDocument) {
		this.email = userDoc.email;
		this.id = userDoc.id;
		this.isActivated = userDoc.isActivated;
	}
}
