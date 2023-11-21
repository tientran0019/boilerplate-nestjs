import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

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
			}),
			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule { }
