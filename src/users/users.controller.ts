import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCreateDTO } from './DTO/user.create.dto';
import { User, UserDocument } from './schema/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@Get()
	async getAllUsers(): Promise<User[]> {
		return await this.userService.getAllUsers();
	}

	@Post()
	register(@Body() createUserDTO: UserCreateDTO): Promise<UserDocument> {
		return this.userService.createUser(createUserDTO);
	}
}
