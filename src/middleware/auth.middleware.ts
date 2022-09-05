import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const authHeader = req.headers.authorization;
		const bearer = authHeader.split(' ')[0];
		const token = authHeader.split(' ')[1];

		if (bearer !== 'Bearer' || !token) {
			return next(
				new UnauthorizedException({
					message: 'Пользователь не авторизован',
				}),
			);
		}

		const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		if (!user) {
			return next(
				new UnauthorizedException({
					message: 'Пользователь не авторизован',
				}),
			);
		}

		req['user'] = user;
		next();
	} catch (e) {
		return next(
			new UnauthorizedException({
				message: 'Пользователь не авторизован',
			}),
		);
	}
}
