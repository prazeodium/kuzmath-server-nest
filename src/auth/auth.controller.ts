import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserCreateDTO } from '../users/DTO/user.create.dto';
import { UserLoginDTO } from '../users/DTO/user.login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// @Post('/login')
	// login(@Body() userLoginDTO: UserLoginDTO) {
	// 	return this.authService.login(userLoginDTO);
	// }

	@Post('/registration')
	async registration(
		@Body() userCreateDTO: UserCreateDTO,
		@Res({ passthrough: true }) response: Response,
	) {
		const result = await this.authService.registration(userCreateDTO);
		response.cookie('refreshToken', result.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return result;
	}
}
