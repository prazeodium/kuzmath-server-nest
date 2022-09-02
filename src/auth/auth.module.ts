import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [forwardRef(() => UsersModule), MailModule, TokensModule],
	exports: [AuthService],
})
export class AuthModule {}
