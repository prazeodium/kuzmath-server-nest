import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { UserCreateDTO } from '../users/DTO/user.create.dto';
import { UserLoginDTO } from '../users/DTO/user.login.dto';
import { AuthService, IUserAndToken } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/registration')
	async registration(
		@Body() userCreateDTO: UserCreateDTO,
		@Res({ passthrough: true }) response: Response,
	): Promise<IUserAndToken> {
		const result = await this.authService.registration(userCreateDTO);
		response.cookie('refreshToken', result.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return result;
	}

	@Post('/login')
	async login(
		@Body() userLoginDTO: UserLoginDTO,
		@Res({ passthrough: true }) response: Response,
	): Promise<IUserAndToken> {
		const result = await this.authService.login(userLoginDTO);
		response.cookie('refreshToken', result.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return result;
	}

	@Post('/logout')
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const { refreshToken } = req.cookies;
		await this.authService.logout(refreshToken);

		res.clearCookie('refreshToken');
		return 'Logout succesfully';
	}

	@Get('/activate/:link')
	async activate(@Param() params, @Res() response) {
		const activationLink = params.link;
		await this.authService.activate(activationLink);
		return response.redirect(process.env.CLIENT_URL);
	}

	@Get('/refresh')
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const { refreshToken } = req.cookies;
		const userData = await this.authService.refresh(refreshToken);
		res.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		return userData;
	}
}
