import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schema/token.schema';
import { TokensService } from './tokens.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
		JwtModule.register({
			secret: process.env.PRIVATE_KEY || 'SECRET',
		}),
	],
	exports: [TokensService],
	providers: [TokensService],
})
export class TokensModule {}
