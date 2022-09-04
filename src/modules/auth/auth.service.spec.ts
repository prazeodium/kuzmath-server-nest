import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail/mail.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	let authService: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService, UsersService, MailService, TokensService],
		})

			.overrideProvider(UsersService)
			.useValue({})
			.overrideProvider(MailService)
			.useValue({})
			.overrideProvider(TokensService)
			.useValue({})
			.compile();

		authService = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});
});
