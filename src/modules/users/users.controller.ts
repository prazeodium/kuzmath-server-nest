import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserCreateDTO } from './DTO/user.create.dto';
import { User, UserDocument } from './schema/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@UseGuards(AuthGuard)
	@Get()
	async getAllUsers(): Promise<User[]> {
		return await this.userService.getAllUsers();
	}
}
