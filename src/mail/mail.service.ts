import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';

const getEmailByEnv = (emails: string | string[]): string | string[] => {
	if (process.env.NODE_ENV === 'development') {
		return process.env.MAIL_LIST_INTERNAL?.split(',');
	}

	return emails;
};

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) { }

	async sendUserConfirmation(user: User, token: string) {
		const url = `https://zellosoft.com/auth/confirm?token=${token}`;

		await this.mailerService.sendMail({
			to: getEmailByEnv(user.email),
			// from: '"Support Team" <support@example.com>', // override default from
			subject: 'Welcome to Nice App! Confirm your Email',
			template: './confirmation', // `.hbs` extension is appended automatically
			context: { // ✏️ filling curly brackets with content
				name: user.fullName,
				url,
			},
		});
	}
}
