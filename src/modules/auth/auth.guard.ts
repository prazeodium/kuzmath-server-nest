import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private tokenService: TokensService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest<Request>();
		try {
			const authHeader = req.headers.authorization;
			const bearer = authHeader.split(' ')[0];
			const token = authHeader.split(' ')[1];

			if (bearer !== 'Bearer' || !token) {
				throw new UnauthorizedException({
					message: 'Пользователь не авторизован',
				});
			}

			const user = this.tokenService.validateAccessToken(token);

			req['user'] = user;
			return true;
		} catch (error) {
			throw new UnauthorizedException({
				message: 'Пользователь не авторизован!',
			});
		}
	}
}
