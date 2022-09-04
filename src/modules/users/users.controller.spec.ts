import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsers: User[] = [
	{
		name: 'George',
		email: 'mail@me.to',
		password: '12345',
		isActivated: true,
		activationLink: 'f45c440b-57d0-4ded-9045-542e38e1ccbe',
	},
	{
		name: 'Eclipse',
		email: 'dont@mail.me',
		password: '54321',
		isActivated: false,
		activationLink: 'f1435a3a-635f-4cee-973b-8cdb1e27f63f',
	},
];

describe('UsersController', () => {
	let controller: UsersController;

	const mockUserService = {
		getAllUsers: jest.fn().mockResolvedValue(mockUsers),

		createUser: jest.fn().mockResolvedValue(mockUsers[0]),

		getUserByEmail: jest.fn((email) =>
			Promise.resolve({ ...mockUsers[0], email }),
		),

		getUserByActivationLink: jest.fn((link) =>
			Promise.resolve({ ...mockUsers[0], link }),
		),
	};
	const mockAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService],
		})
			.overrideProvider(UsersService)
			.useValue(mockUserService)
			.overrideGuard(AuthGuard)
			.useValue(mockAuthGuard)
			.compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
