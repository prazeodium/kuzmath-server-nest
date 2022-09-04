import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
	let mailService: MailService;
	let mailerService: MailerService;

	beforeEach(async () => {
		const MailerServiceProvider = {
			provide: MailerService,
			useFactory: () => ({
				sendMail: jest.fn(({}) => 'SEND'),
			}),
		};
		const module: TestingModule = await Test.createTestingModule({
			providers: [MailService, MailerServiceProvider],
		}).compile();

		mailService = module.get<MailService>(MailService);
		mailerService = module.get<MailerService>(MailerService);
	});

	it('MailService - should be defined', () => {
		expect(mailService).toBeDefined();
	});

	describe('sendActivationMail', () => {
		it('should call sendMail method', async () => {
			await mailService.sendActivationMail('to', 'link');
			expect(mailerService.sendMail).toHaveBeenCalled();
		});
	});
});
