import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		forwardRef(() => UsersModule),
		JwtModule.register({
			secret: process.env.PRIVATE_KEY || 'SECRET',
		}),
		MailModule,
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
