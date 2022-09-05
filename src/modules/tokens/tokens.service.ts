import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schema/token.schema';
import { JwtService } from '@nestjs/jwt';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class TokensService {
	constructor(
		@InjectModel('Token') private readonly tokenModel: Model<Token>,
		private jwtService: JwtService,
	) {}

	async findToken(refreshToken: string): Promise<TokenDocument> {
		const tokenData = await this.tokenModel.findOne({ refreshToken });
		return tokenData;
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

	validateAccessToken(token: string): ITokenData {
		const userData = this.jwtService.verify(token, {
			secret: process.env.JWT_ACCESS_SECRET,
		});

		return userData;
	}

	validateRefreshToken(token: string): ITokenData {
		const userData = this.jwtService.verify(token, {
			secret: process.env.JWT_REFRESH_SECRET,
		});

		return userData;
	}
}

export interface IAccRefTokens {
	accessToken: string;
	refreshToken: string;
}

export interface ITokenData {
	email: string;
	id: string;
	isActivated: boolean;

	iat: Date;
	exp: Date;
}
