import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
	imports: [
		MailerModule.forRoot({
			// transport: 'smtps://user@example.com:topsecret@smtp.example.com',
			// or
			transport: {
				host: 'smtp.ethereal.email',
				port: 587,
				secure: false,
				auth: {
					user: 'ps5alt7w6e4cgmxo@ethereal.email',
					pass: 'bB52tj4vhEc4zhcgvm',
				},
			},
			// defaults: {
			// 	from: '"No Reply" <noreply@example.com>',
			// },
			// template: {
			// 	dir: join(__dirname, 'templates'),
			// 	adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
			// 	options: {
			// 		strict: true,
			// 	},
			// },
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
