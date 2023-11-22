import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyObject, Model, ObjectId } from 'mongoose';
import otpGenerator from 'otp-generator';
import { MailService } from 'src/mail/mail.service';
import { decrypt, encrypt } from 'src/utils/crypto';
import { Otp } from './schemas/otp.schema';

export interface OtpObject {
	code: string,
	ttl: string | number,
}

export interface OtpOptions {
	digits?: boolean,
	lowerCaseAlphabets?: boolean,
	upperCaseAlphabets?: boolean,
	specialChars?: boolean,
}

export interface OtpPayload {
	createdAt: number,
	check: string,
	action: string,
	otpId: ObjectId,
};

@Injectable()
export class OtpService {
	constructor(
		@InjectModel(Otp.name)
		private readonly otpModel: Model<Otp>,
		private mailService: MailService,
	) { }

	generateOtp = (length: number = 6, options: OtpOptions = { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false }): OtpObject => {
		return {
			code: otpGenerator.generate(length, options),
			ttl: process.env.OTP_EXPIRES_IN,
		};
	};

	async generateVerificationKey(payload: OtpPayload): Promise<string> {
		const key = await encrypt(payload, process.env.OTP_SECRET);

		return key;
	};

	async parseVerificationKey(token: string): Promise<OtpPayload> {
		const payload = await decrypt(token, process.env.OTP_SECRET);

		return payload as OtpPayload;
	};

	async send(contactData: AnyObject): Promise<{ verificationKey: string }> {
		const { email, phoneNumber, action } = contactData;

		try {
			if (!action) {
				throw new Error('Action type not provided');
			}
			if (!email && !phoneNumber) {
				throw new Error('Email and Phone number not provided');
			}
			if (email && phoneNumber) {
				throw new Error('OTP can only be sent via email or phone number');
			}

			// Generate OTP
			const otpData = this.generateOtp();

			// Create OTP instance in DB
			const otpInstance = await this.otpModel.create({
				...otpData,
				action,
			});

			// Create details object containing the phone number and otp id
			const details: OtpPayload = {
				createdAt: otpInstance.createdAt,
				check: email || phoneNumber,
				action,
				otpId: otpInstance.id,
			};

			// Encrypt the details object
			const verificationKey = await this.generateVerificationKey(details);

			if (email) {
				await this.mailService.sendEmailOtp(email, otpData);
			}

			return { verificationKey };
		} catch (error) {
			throw new BadRequestException(error.message);

		}
	};

	async verify(verificationKey: string, otp: string, check: string): Promise<Otp> {
		try {
			if (!verificationKey) {
				throw new Error('Verification Key not provided');
			}
			if (!otp) {
				throw new Error('OTP not Provided');
			}
			if (!check) {
				throw new Error('Check not Provided');
			}

			// Check if verification key is altered or not and store it in variable decoded after decryption

			const decryptData = await this.parseVerificationKey(verificationKey);

			// Check if the OTP was meant for the same email or phone number for which it is being verified
			if (decryptData.check !== check) {
				throw new Error('OTP was not sent to this particular email or phone number');
			}

			const otpInstance = await this.otpModel.findById(decryptData.otpId);

			// Check if OTP is available in the DB
			if (!otpInstance) {
				throw new Error('OTP is not exist');
			}

			// Check if OTP is already used or not
			if (otpInstance.used) {
				throw new Error('OTP already used');
			}

			// Check if OTP is expired or not
			if (Date.now() - otpInstance.createdAt > otpInstance.ttl) {
				throw new Error('OTP expired');
			}
			// Check if OTP is expired or not
			if (Date.now() - decryptData.createdAt > otpInstance.ttl) {
				throw new Error('OTP expired');
			}

			// Check if OTP is equal to the OTP in the DB
			if (otpInstance.code !== otp) {
				throw new Error('OTP NOT matched');
			}

			// Mark OTP as verified or used
			otpInstance.used = true;

			await otpInstance.save();

			// const resData = {
			// 	success: true,
			// 	message: 'OTP Matched',
			// 	check,
			// 	action: decryptData.action,
			// };

			return otpInstance;
		} catch (error) {
			throw new HttpException(error.message || 'Invalid OTP', HttpStatus.NOT_ACCEPTABLE);;

		}
	};
}
