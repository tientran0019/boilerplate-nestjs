/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:19:50

* Last updated on: 2023-11-23 23:19:50
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { User } from 'src/users/schemas/user.schema';
import convertMsToMinutesSeconds from 'src/utils/msToMinutes';

const getEmailByEnv = (emails: string | string[]): string | string[] => {
	if (process.env.NODE_ENV === 'development') {
		return process.env.MAIL_LIST_INTERNAL?.split(',');
	}

	return emails;
};

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) { }

	async sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo> {
		return await this.mailerService.sendMail(sendMailOptions);
	}

	async sendUserVerification(email: string, otpData: { code: string, ttl: string | number }): Promise<SentMessageInfo> {
		return await this.mailerService.sendMail({
			to: getEmailByEnv(email),
			// from: '"Support Team" <support@example.com>', // override default from
			subject: 'Welcome to Nice App! Confirm your Email',
			template: './verification', // `.hbs` extension is appended automatically
			context: { // ✏️ filling curly brackets with content
				ttl: convertMsToMinutesSeconds(otpData.ttl, false),
				code: otpData.code,
			},
		});
	}

	async sendEmailOtp(email: string, otpData: { code: string, ttl: string | number }): Promise<SentMessageInfo> {
		return await this.mailerService.sendMail({
			to: getEmailByEnv(email),
			subject: 'Verify your identity',
			template: './otp', // `.hbs` extension is appended automatically
			context: { // ✏️ filling curly brackets with content
				ttl: convertMsToMinutesSeconds(otpData.ttl, false),
				code: otpData.code,
			},
		});
	}

	async sendUserResetPassword(user: User, token: string): Promise<SentMessageInfo> {
		const url = `https://zellosoft.com/auth/confirm?token=${token}`;

		return await this.mailerService.sendMail({
			to: getEmailByEnv(user.email),
			// from: '"Support Team" <support@example.com>', // override default from
			subject: 'Password reset',
			template: './reset-password', // `.hbs` extension is appended automatically
			context: { // ✏️ filling curly brackets with content
				name: user.fullName,
				url,
			},
		});
	}
}
