import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schema/token.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {
	constructor(
		@InjectModel('Token') private readonly tokenModel: Model<Token>,
		private jwtService: JwtService,
	) {}

	async saveToken(
		userId: string,
		refreshToken: string,
	): Promise<TokenDocument> {
		const tokenData = await this.tokenModel.findOne({ user: userId });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}
		const token = await this.tokenModel.create({ user: userId, refreshToken });
		return token;
	}

	generateTokens(payload: string | object | Buffer): IAccRefTokens {
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

	async removeToken(refreshToken: string): Promise<void> {
		await this.tokenModel.deleteOne({ refreshToken });
	}
	/*

	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
			return userData;
		} catch (e) {
			return null;
		}
	}

	validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
			return userData;
		} catch (e) {
			return null;
		}
	}
	*/

	/*
	async findToken(refreshToken) {
		const tokenData = await tokenModel.findOne({ refreshToken });
		return tokenData;
	}
	*/
}

export interface IAccRefTokens {
	accessToken: string;
	refreshToken: string;
}
