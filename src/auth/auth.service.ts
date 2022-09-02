import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { MailService } from '../mail/mail.service';
import { UserCreateDTO } from '../users/DTO/user.create.dto';
import { UserDTO } from '../users/DTO/user.dto';
import { UserLoginDTO } from '../users/DTO/user.login.dto';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private mailService: MailService,
		private tokenService: TokensService,
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

		const hashPassword = await hash(userCreateDTO.password, 7);

		const userDoc = await this.userService.createUser({
			...userCreateDTO,
			password: hashPassword,
		});
		const user = new UserDTO(userDoc);

		await this.mailService.sendActivationMail(
			userDoc.email,
			`${process.env.API_URL}/auth/activate/${userDoc.activationLink}`,
		);

		const tokens = this.tokenService.generateTokens({ ...user });
		await this.tokenService.saveToken(user.id, tokens.refreshToken);
		return { ...tokens, user };
	}

	async login(userLoginDTO: UserLoginDTO): Promise<IUserAndToken> {
		const existedUser = await this.userService.getUserByEmail(
			userLoginDTO.email,
		);
		if (!existedUser) {
			throw new NotFoundException('Пользователь с таким email не найден.');
		}

		const isPassEqual = await compare(
			userLoginDTO.password,
			existedUser.password,
		);
		if (!isPassEqual) {
			throw new UnauthorizedException({ message: 'Введен неверный пароль' });
		}

		const userDTO = new UserDTO(existedUser);
		const tokens = this.tokenService.generateTokens({ userDTO });
		await this.tokenService.saveToken(userDTO.id, tokens.refreshToken);
		return { ...tokens, user: userDTO };
	}

	async logout(refreshToken: string): Promise<void> {
		await this.tokenService.removeToken(refreshToken);
	}

	async activate(activationLink: string) {
		const user = await this.userService.getUserByActivationLink(activationLink);
		if (!user) {
			throw new HttpException(
				'Неккоректная ссылка активации',
				HttpStatus.BAD_REQUEST,
			);
		}
		if (user.isActivated) {
			throw new HttpException(
				'Пользователь уже активирован',
				HttpStatus.BAD_REQUEST,
			);
		}
		user.isActivated = true;
		await user.save();
	}
}

export interface IUserAndToken {
	accessToken: string;
	refreshToken: string;
	user: UserDTO;
}
