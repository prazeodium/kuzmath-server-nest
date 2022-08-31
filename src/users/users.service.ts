import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDTO } from './DTO/user.create.dto';
import { UserDocument, User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<UserDocument>,
	) {}

	async getAllUsers(): Promise<User[]> {
		return await this.userModel.find().exec();
	}

	async createUser(userCreateDTO: UserCreateDTO): Promise<UserDocument> {
		const hashPassword = await bcrypt.hash(userCreateDTO.password, 7);
		const activationLink = uuidv4();
		const user = { ...userCreateDTO, password: hashPassword, activationLink };
		const userDocument = await this.userModel.create(user);
		return userDocument;
	}

	async getUserByEmail(email: string) {
		const user = await this.userModel.findOne({ email });
		return user;
	}
}
