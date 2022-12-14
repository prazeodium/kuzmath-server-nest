import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
		const activationLink = uuidv4();
		const user = { ...userCreateDTO, activationLink };
		const userDocument = await this.userModel.create(user);
		return userDocument;
	}

	async getUserByEmail(email: string) {
		try {
			const user = await this.userModel.findOne({ email });
			return user;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	async getUserByActivationLink(activationLink: string) {
		try {
			const user = await this.userModel.findOne({ activationLink });
			return user;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}
}
