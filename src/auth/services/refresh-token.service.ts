import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { Model } from 'mongoose';
import { AccessTokenService } from './access-token.service';
import { ClientInfo, TokenObject } from '../auth.interface';
import { FastifyRequest } from 'fastify';
import { User } from 'src/users/schemas/user.schema';
import async from 'async';
import { UserStatus } from 'src/users/user.enum';

@Injectable()
export class RefreshTokenService {
	constructor(
		@InjectModel(RefreshToken.name)
		private readonly refreshTokenModel: Model<RefreshToken>,
		@InjectModel(User.name)
		private readonly usersModel: Model<User>,
		private accessTokenService: AccessTokenService,
		private jwtService: JwtService,
	) { }

	/**
	 * Generate a refresh token, bind it with the given user profile + access
	 * token, then store them in backend.
	 */
	async generateToken(
		userId: string,
		token: string,
		clientInfo: ClientInfo,
	): Promise<string> {
		const data = {
			token: uuidv4(),
		};
		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: process.env.REFRESH_EXPIRES_IN,
			issuer: process.env.REFRESH_ISSUER,
			secret: process.env.REFRESH_SECRET,
		});

		await this.refreshTokenModel.create({
			...clientInfo,
			userId,
			refreshToken,
			currentToken: token,
		});

		return refreshToken;
	}

	/*
	 * Refresh the access token bound with the given refresh token.
	 */

	async refreshToken(refreshToken: string, clientInfo: ClientInfo): Promise<TokenObject> {
		try {
			if (!refreshToken) {
				throw new Error(
					`Error verifying token : 'refresh token' is null`,
				);
			}

			const userRefreshData = await this.verifyToken(refreshToken);

			// compare the ip or useragent attributes in the clientInfo object to the ip in the database
			if (clientInfo.ip !== userRefreshData.ip || clientInfo.useragent !== userRefreshData.userAgent) {
				// Force logout of all sessions of this user if the client info different from the client info that was stored in db when the user login
				this.revokeAllToken(userRefreshData.userId.toString());
				throw new Error('Client is invalid');
			}

			await this.revokeCurrentToken(userRefreshData.currentToken!);

			const user = await this.usersModel.findById(
				userRefreshData.userId,
			);

			if (user.status !== UserStatus.ACTIVE) {
				throw new Error('User is inactive');
			}

			// create a JSON Web Token based on the user profile
			const token = await this.accessTokenService.generateToken(user);

			try {
				// store token to refresh token
				userRefreshData.currentToken = token;
				await userRefreshData.save();
			} catch (e) {
				// ignore
			}

			return {
				accessToken: token,
				expiresIn: process.env.TOKEN_EXPIRES_IN,
			};
		} catch (error) {
			throw new UnauthorizedException(
				`Error verifying token : ${error.message}`,
			);
		}
	}

	async revokeCurrentToken(token: string): Promise<void> {
		try {
			// revoke old assess token if token is valid
			if (token) {
				await this.accessTokenService.verifyToken(token);

				await this.accessTokenService.revokeToken(token);
			}
		} catch (e) {
			// ignore
		}
	}

	async revokeToken(refreshToken: string): Promise<void> {
		try {
			const userRefreshData = await this.verifyToken(refreshToken);

			await this.revokeCurrentToken(userRefreshData.currentToken!);

			// await this.refreshTokenModel.findOneAndUpdate({ refreshToken }, { revoked: true, revokedAt: +new Date() });
			userRefreshData.revoked = true;
			userRefreshData.revokedAt = +new Date();
			await userRefreshData.save();
		} catch (error) {
			// ignore
		}
	}

	async revokeAllToken(userId: string): Promise<void> {
		try {
			const rfs = await this.refreshTokenModel.find({ userId, revoked: false }) || [];

			await async.eachLimit(rfs, 10, async (rf: RefreshToken) => {
				await this.revokeCurrentToken(rf.currentToken);

				rf.revoked = true;
				rf.revokedAt = +new Date();

				await rf.save();
			});
		} catch (error) {
			// ignore
		}
	}

	/**
	 * Verify the validity of a refresh token, and make sure it exists in backend.
	 * @param refreshToken
	 */
	async verifyToken(
		refreshToken: string,
	): Promise<RefreshToken> {
		try {
			await this.jwtService.verifyAsync(refreshToken, { secret: process.env.REFRESH_SECRET });

			const userRefreshData = await this.refreshTokenModel.findOne({ refreshToken });

			if (!userRefreshData) {
				throw new Error(
					`Error verifying token : Invalid Token`,
				);
			}

			if (userRefreshData.revoked) {
				throw new Error(
					`Error verifying token : Token is revoked`,
				);
			}
			return userRefreshData;
		} catch (error) {
			throw new UnauthorizedException(
				`Error verifying token : ${error.message}`,
			);
		}
	}

	extractTokenFromHeader(request: FastifyRequest) {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Refresh' ? token : undefined;
	}
}
