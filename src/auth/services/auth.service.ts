import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FastifyRequest } from 'fastify';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';

import { UserStatus } from 'src/constants/user.enum';
import { ResLoginObject, TokenObject } from 'src/auth/types';
import { UserCredentials } from 'src/auth/schemas/user-credentials.schema';
import { User } from 'src/users/schemas/user.schema';

import { RefreshTokenService } from 'src/auth/services/refresh-token.service';
import { AccessTokenService } from 'src/auth/services/access-token.service';

import { SignupDto } from 'src/auth/dto/signup.dto';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { ChangePasswordDto } from 'src/auth/dto/change-password';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserCredentials.name)
		private readonly userCredentialsModel: Model<UserCredentials>,
		@InjectModel(User.name)
		private readonly usersModel: Model<User>,
		private accessTokenService: AccessTokenService,
		private refreshTokenService: RefreshTokenService,
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

	async changePassword(userId: string, data: ChangePasswordDto): Promise<object> {
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

		return {
			success: true,
		};
	}

	async login(dto: CredentialsDto): Promise<ResLoginObject> {
		const user = await this.verifyCredentials(dto);

		const token = await this.accessTokenService.generateToken(user);

		await this.updateLastLogin(user);

		return {
			user,
			backendTokens: {
				accessToken: token,
				refreshToken: await this.refreshTokenService.generateToken(user.id, token),
				expiresIn: process.env.TOKEN_EXPIRES_IN,
			},
		};
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

	async refreshToken(req: FastifyRequest): Promise<TokenObject> {
		const refreshToken = this.refreshTokenService.extractTokenFromHeader(req);

		if (!refreshToken) {
			throw new UnauthorizedException(`Error verifying token : Token not found`);
		}

		return await this.refreshTokenService.refreshToken(refreshToken);
	}

	async logout(req: FastifyRequest): Promise<object> {
		try {
			// const accessToken = this.accessTokenService.extractTokenFromHeader(req);
			const refreshToken = this.refreshTokenService.extractTokenFromHeader(req);

			if (!refreshToken) {
				throw new UnauthorizedException(`Error verifying token : Invalid Token`);
			}

			// await this.accessTokenService.revokeToken(accessToken);

			await this.refreshTokenService.revokeToken(refreshToken);

			return {
				success: true,
			};
		} catch (err) {
			throw new InternalServerErrorException(err.message);
		}
	}
}
