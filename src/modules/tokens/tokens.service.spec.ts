import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
	let service: TokensService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TokensService,
				{
					provide: getModelToken('Token'),
					useValue: {},
				},
				JwtService,
			],
		})
			.overrideProvider(JwtService)
			.useValue({})
			.compile();

		service = module.get<TokensService>(TokensService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
