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
import convertMsToMinutesSeconds from '@utils/msToMinutes';

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
		if (!email) {
			return null;
		}
		return await this.mailerService.sendMail({
			to: getEmailByEnv(email),
			// from: '"Support Team" <support@example.com>', // override default from
			subject: '[Nestjs Boilerplate] Welcome to Nestjs App! Confirm your Email',
			template: './verification', // `.hbs` extension is appended automatically
			context: { // ✏️ filling curly brackets with content
				ttl: convertMsToMinutesSeconds(otpData.ttl, false),
				code: otpData.code,
			},
		});
	}

	async sendEmailOtp(email: string, otpData: { code: string, ttl: string | number }): Promise<SentMessageInfo> {
		if (!email) {
			return null;
		}

		return await this.mailerService.sendMail({
			to: getEmailByEnv(email),
			subject: '[Nestjs Boilerplate] Verify your identity',
			template: './otp', // `.hbs` extension is appended automatically
			context: { // ✏️ filling curly brackets with content
				ttl: convertMsToMinutesSeconds(otpData.ttl, false),
				code: otpData.code,
			},
		});
	}

	async sendUserResetPassword(email: string, otpData: { code: string, ttl: string | number }): Promise<SentMessageInfo> {
		if (!email) {
			return null;
		}

		return await this.mailerService.sendMail({
			to: getEmailByEnv(email),
			subject: '[Nestjs Boilerplate] Password reset',
			template: './reset-password',
			context: {
				ttl: convertMsToMinutesSeconds(otpData.ttl, false),
				code: otpData.code,
			},
		});
	}

	async sendUserTerminateRequest(emailData: { email: string, ttl: string, fullName: string, code: string }): Promise<SentMessageInfo> {
		if (!emailData.email) {
			return null;
		}

		return await this.mailerService.sendMail({
			to: getEmailByEnv(emailData.email),
			subject: '[Nestjs Boilerplate] Account deletion notice',
			template: './terminate-account',
			context: {
				ttl: convertMsToMinutesSeconds(emailData.ttl, false),
				code: emailData.code,
				fullName: emailData.fullName,
			},
		});
	}

	async sendUserCreatedAccount(user: { email: string, password: string, fullName: string }): Promise<SentMessageInfo> {
		if (!user.email) {
			return null;
		}

		return await this.mailerService.sendMail({
			to: getEmailByEnv(user.email),
			subject: '[Nestjs Boilerplate] Your account has been created successfully',
			template: './created-account',
			context: user,
		});
	}
}
