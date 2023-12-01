import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import * as otpGenerator from 'otp-generator';
import { decrypt, encrypt } from '@utils/crypto.util';
import { Otp } from './schemas/otp.schema';
import { OtpActions } from '@modules/otp/otp.enum';

export interface OtpOptions {
	digits?: boolean;
	lowerCaseAlphabets?: boolean;
	upperCaseAlphabets?: boolean;
	specialChars?: boolean;
}

export interface OtpPayload {
	createdAt: number,
	check: string,
	action: OtpActions,
	otpId: ObjectId,
};

export interface VerificationPayload {
	verificationKey: string,
	otp: string,
	check: string,
	action: OtpActions,
};

export interface OtpObject {
	verificationKey: string,
	code: string,
	ttl: string,
	data: OtpPayload,
}

@Injectable()
export class OtpService {
	readonly ttl = process.env.OTP_EXPIRES_IN;
	readonly secret = process.env.OTP_SECRET;

	constructor(
		@InjectModel(Otp.name)
		private readonly otpModel: Model<Otp>,
	) { }

	private generateCode = (length: number = 6, options: OtpOptions = { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false }): string => {
		return otpGenerator.generate(length, options);
	};

	private async generateVerificationKey(payload: OtpPayload): Promise<string> {
		const key = await encrypt(payload, this.secret);

		return key;
	};

	private async parseVerificationKey(token: string): Promise<OtpPayload> {
		const payload = await decrypt(token, this.secret);

		return payload as OtpPayload;
	};

	async generateOtp(payload: { check: string, action: OtpActions }): Promise<OtpObject> {
		const { check, action } = payload;

		if (!action) {
			throw new Error('Action type not provided');
		}
		if (!check) {
			throw new Error('Checker not provided');
		}

		// Generate OTP
		const code = this.generateCode();

		// Create OTP instance in DB
		const otpInstance = await this.otpModel.create({
			code,
			ttl: this.ttl,
			action,
		});

		// Create details object containing the phone number and otp id
		const details: OtpPayload = {
			createdAt: otpInstance.createdAt,
			check,
			action,
			otpId: otpInstance.id,
		};

		// Encrypt the details object
		const verificationKey = await this.generateVerificationKey(details);

		// if (email) {
		// 	await this.mailService.sendEmailOtp(email, {
		// 		code,
		// 		ttl: this.ttl,
		// 		userName,
		// 	});
		// }

		return {
			verificationKey,
			code,
			ttl: this.ttl,
			data: details,
		};
	};

	async verifyOtp(payload: VerificationPayload): Promise<Otp> {
		const { verificationKey, otp, check, action } = payload;

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
			if (!action) {
				throw new Error('Action not Provided');
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

			if (decryptData.action !== action || action !== otpInstance.action) {
				throw new Error('Invalid action');
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
			throw new HttpException(error.message || 'Invalid OTP', HttpStatus.GONE);

		}
	};
}
