import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CredentialsDto } from '@modules/auth/dto/credentials.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';

import { UserStatus, UserVerificationProviders } from '@modules/users/user.enum';
import { ClientInfoData, ResLoginObject, TokenObject } from '@modules/auth/auth.interface';
import { UserCredentials } from '@modules/auth/schemas/user-credentials.schema';
import { User } from '@modules/users/schemas/user.schema';

import { RefreshTokenService } from '@modules/auth/services/refresh-token.service';
import { AccessTokenService } from '@modules/auth/services/access-token.service';

import { SignupDto } from '@modules/auth/dto/signup.dto';
import { UpdateProfileDto } from '@modules/auth/dto/update-profile.dto';
import { ChangePasswordDto } from '@modules/auth/dto/change-password';
import { MailService } from '@modules/mail/mail.service';
import { OtpObject, OtpService } from '@modules/otp/otp.service';
import { OtpActions } from '@modules/otp/otp.enum';
import { VerifyDto } from '../dto/verify.dto';
import { VerifyRequestDto } from '../dto/verify-request.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserCredentials.name)
		private readonly userCredentialsModel: Model<UserCredentials>,
		@InjectModel(User.name)
		private readonly usersModel: Model<User>,
		private accessTokenService: AccessTokenService,
		private refreshTokenService: RefreshTokenService,
		private mailService: MailService,
		private otpService: OtpService,
	) { }

	async findById(id: string): Promise<User> {
		return await this.usersModel.findById(id).exec();
	}

	async signup(dto: SignupDto): Promise<User> {
		const { password, ...userData } = dto;

		const user = await this.usersModel.findOne({
			email: dto.email,
		}).exec();

		if (user) throw new ConflictException('Email duplicated');

		const newUser = await this.usersModel.create(userData);

		await this.userCredentialsModel.create({
			password: await hash(password, 10),
			userId: newUser.id,
		});

		return newUser;
	}

	async login(dto: CredentialsDto, clientInfo: ClientInfoData): Promise<ResLoginObject> {
		const user = await this.verifyCredentials(dto);

		this.verifyUserStatus(user);

		if (process.env.FORCE_USER_VERIFICATION) {
			const type = UserVerificationProviders[process.env.FORCE_USER_VERIFICATION];

			if (!user.verifiedBy.includes(type)) {
				const otpData: OtpObject = await this.requestVerification({
					type,
					check: user.id,
				});

				if (!otpData) {
					throw new BadRequestException('Verifying failed');
				}

				return {
					user,
					verificationKey: otpData.verificationKey,
				};
			}
		}

		const token = await this.accessTokenService.generateToken(user);

		await this.updateLastLogin(user);

		return {
			user,
			backendTokens: {
				accessToken: token,
				refreshToken: await this.refreshTokenService.generateToken(user.id, token, clientInfo),
				expiresIn: process.env.TOKEN_EXPIRES_IN,
			},
		};
	}

	async requestVerification(dto: VerifyRequestDto): Promise<OtpObject> {
		const { type, check } = dto;

		const user = await this.usersModel.findById(check);

		this.verifyUserStatus(user);

		if (!user) {
			throw new BadRequestException('User not found');
		}
		if (user.verifiedBy.includes(dto.type as UserVerificationProviders)) {
			throw new BadRequestException('User have verified already');
		}

		const action = type === UserVerificationProviders.PHONE ? OtpActions.VERIFY_PHONE : OtpActions.VERIFY_EMAIL;

		const otpData = await this.otpService.generateOtp({ check, action });

		if (type === UserVerificationProviders.PHONE) {
			// TODO: send OTP to verification via phone here
			// send to user.phone
			console.log('DEV ~ file: auth.service.ts:110 ~ AuthService ~ requestVerification ~ otpData:', otpData);
		} else {
			await this.mailService.sendUserVerification(user.email, {
				ttl: otpData.ttl,
				code: otpData.code,
			});
		}

		return otpData;
	}

	async verify(dto: VerifyDto): Promise<User> {
		const action = dto.type === UserVerificationProviders.PHONE ? OtpActions.VERIFY_PHONE : OtpActions.VERIFY_EMAIL;

		const user = await this.usersModel.findById(dto.check);

		this.verifyUserStatus(user);

		if (!user) {
			throw new BadRequestException('User not found');
		}
		if (user.verifiedBy.includes(dto.type as UserVerificationProviders)) {
			throw new BadRequestException('User have verified already');
		}

		await this.otpService.verifyOtp({
			action,
			check: dto.check,
			otp: dto.otp,
			verificationKey: dto.verificationKey,
		});

		// mark this user as verified by adding the Verification provider into the `verifiedBy` attribute
		user.verifiedBy = [...(user.verifiedBy ?? []), dto.type as UserVerificationProviders];

		await user.save({
			timestamps: false,
		});

		return user;
	}

	async updateProfile(userId: string, data: UpdateProfileDto): Promise<User> {
		return await this.usersModel.findByIdAndUpdate(userId, data, { new: true }).exec();
	}

	async updateLastLogin(user: User): Promise<void> {
		try {
			user.lastLoginAt = +new Date();

			await user.save({
				timestamps: false,
			});
		} catch (error) {
			// ignore
		}
	}

	verifyUserStatus(user: User): boolean {
		if (!user) {
			throw new BadRequestException('User not found');
		}

		if (user.status !== UserStatus.ACTIVE) {
			throw new UnauthorizedException('User is inactive');
		}

		return true;
	}

	async findCredentials(userId: string): Promise<UserCredentials> {
		return await this.userCredentialsModel.findOne({
			userId,
		}).exec();
	}

	async verifyCredentials(credentials: CredentialsDto): Promise<User> {
		const { email, password } = credentials;

		const invalidCredentialsError = 'Invalid email or password.';

		if (!email) {
			throw new UnauthorizedException(invalidCredentialsError);
		}
		const foundUser = await this.usersModel.findOne({
			email: email,
		}).exec();

		if (!foundUser) {
			throw new UnauthorizedException(invalidCredentialsError);
		}

		const credentialsFound = await this.findCredentials(
			foundUser.id,
		);

		if (!credentialsFound) {
			throw new UnauthorizedException(invalidCredentialsError);
		}

		const passwordMatched = await compare(
			password,
			credentialsFound.password,
		);

		if (!passwordMatched) {
			throw new UnauthorizedException(invalidCredentialsError);
		}

		return foundUser;
	}

	async refreshToken(refreshToken: string | undefined, clientInfo: ClientInfoData): Promise<TokenObject> {
		if (!refreshToken) {
			throw new UnauthorizedException(`Error verifying token : Token not found`);
		}

		return await this.refreshTokenService.refreshToken(refreshToken, clientInfo);
	}

	async logout(refreshToken: string | undefined): Promise<void> {
		try {
			if (!refreshToken) {
				throw new UnauthorizedException(`Error verifying token : Invalid Token`);
			}

			// await this.accessTokenService.revokeToken(accessToken);

			await this.refreshTokenService.revokeToken(refreshToken);
		} catch (err) {
			throw new InternalServerErrorException(err.message);
		}
	}

	async changePassword(userId: string, data: ChangePasswordDto): Promise<void> {
		if (data.newPassword === data.oldPassword) {
			throw new BadRequestException('The old password must be different from the New password');
		}
		const credentialsFound = await this.findCredentials(userId);

		if (!credentialsFound) {
			throw new UnauthorizedException();
		}

		const passwordMatched = await compare(
			data.oldPassword,
			credentialsFound.password,
		);

		if (!passwordMatched) {
			throw new BadRequestException('The old password is incorrect');
		}

		credentialsFound.password = await hash(data.newPassword, 10);

		await credentialsFound.save();

		await this.refreshTokenService.revokeAllToken(userId);
	}

	async forgotPassword(dto: ForgotPasswordDto): Promise<{ verificationKey: string, check: string }> {
		const { email } = dto;

		const user = await this.usersModel.findOne({ email });

		if (!user) {
			throw new BadRequestException('User not found');
		}

		this.verifyUserStatus(user);


		const otpData = await this.otpService.generateOtp({ check: user.id, action: OtpActions.FORGOT_PASSWORD });

		await this.mailService.sendUserResetPassword(email, {
			ttl: otpData.ttl,
			code: otpData.code,
		});

		return {
			verificationKey: otpData.verificationKey,
			check: user.id,
		};
	}

	async resetPassword(dto: ResetPasswordDto): Promise<{ success: boolean }> {
		await this.otpService.verifyOtp({
			action: OtpActions.FORGOT_PASSWORD,
			check: dto.check,
			otp: dto.otp,
			verificationKey: dto.verificationKey,
		});

		const password = await hash(dto.password, 10);

		await this.userCredentialsModel.findByIdAndUpdate(dto.check, { password });

		await this.refreshTokenService.revokeAllToken(dto.check);

		return {
			success: true,
		};
	}

}
