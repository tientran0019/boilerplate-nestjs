/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:19:40

* Last updated on: 2023-11-23 23:19:40
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from 'src/mail/mail.service';

@Global() // 👈 global module
@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => ({
				// transport: config.get("MAIL_TRANSPORT"),
				// or
				transport: {
					host: config.get('MAIL_HOST'),
					secure: false,
					auth: {
						user: config.get('MAIL_USER'),
						pass: config.get('MAIL_PASSWORD'),
					},
					debug: true,
				},
				defaults: {
					from: `"${config.get('MAIL_NAME')}" <${config.get('MAIL_FROM')}>`,
				},
				template: {
					dir: join(__dirname, 'templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
				options: {
					partials: {
						dir: join(__dirname, 'templates', 'partials'),
						options: {
							strict: true,
						},
					},
				},
				preview: config.get('NODE_ENV') === 'development',
			}),
			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule { }
