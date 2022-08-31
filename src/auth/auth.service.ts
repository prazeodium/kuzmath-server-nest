import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCreateDTO } from '../users/DTO/user.create.dto';
import { UserDTO } from '../users/DTO/user.dto';
import { UserLoginDTO } from '../users/DTO/user.login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

	async registration(userCreateDTO: UserCreateDTO): Promise<IUserAndToken> {
		const candidate = await this.userService.getUserByEmail(
			userCreateDTO.email,
		);
		if (candidate) {
			throw new HttpException(
				'Пользователь с таким email существует',
				HttpStatus.BAD_REQUEST,
			);
		}

		const userDoc = await this.userService.createUser(userCreateDTO);
		const user = new UserDTO(userDoc);

		// Отправить email
		const tokens = this.generateTokens({ ...user });
		// Сохранить токены
		return { ...tokens, user };
	}

	private generateTokens(payload) {
		const accessToken = this.jwtService.sign(payload, {
			secret: process.env.JWT_ACCESS_SECRET,
			expiresIn: '30m',
		});
		const refreshToken = this.jwtService.sign(payload, {
			secret: process.env.JWT_REFRESH_SECRET,
			expiresIn: '30d',
		});

		return {
			accessToken,
			refreshToken,
		};
	}
}

export interface IUserAndToken {
	accessToken: string;
	refreshToken: string;
	user: UserDTO;
}
