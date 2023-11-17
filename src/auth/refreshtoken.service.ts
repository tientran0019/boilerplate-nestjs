import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';
import { Model } from 'mongoose';
import { AccessTokenService } from './accesstoken.service';
import { TokenObject } from './types';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RefreshTokenService {
	constructor(
		@InjectModel(RefreshToken.name)
		private readonly refreshTokenModel: Model<RefreshToken>,
		private usersService: UsersService,
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
		dataExtra: object = {},
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
			...dataExtra,
			userId,
			refreshToken,
			currentToken: token,
		});

		return refreshToken;
	}

	/*
	 * Refresh the access token bound with the given refresh token.
	 */

	async refreshToken(refreshToken: string): Promise<TokenObject> {
		try {
			if (!refreshToken) {
				throw new UnauthorizedException(
					`Error verifying token : 'refresh token' is null`,
				);
			}

			const userRefreshData = await this.verifyToken(refreshToken);

			await this.revokeCurrentToken(userRefreshData.currentToken!);

			const user = await this.usersService.findById(
				userRefreshData.userId.toString(),
			);

			// create a JSON Web Token based on the user profile
			const token = await this.accessTokenService.generateToken(user);

			try {
				// store token to refresh token
				await this.refreshTokenModel.findOneAndUpdate({ refreshToken }, { currentToken: token });
			} catch (e) {
				// ignore
			}

			return {
				accessToken: token,
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
			console.log('DEV ~ file: refreshtoken.service.ts:99 ~ RefreshTokenService ~ revokeCurrentToken ~ e:', e);
			// ignore
		}
	}

	async revokeToken(refreshToken: string): Promise<void> {
		try {
			const userRefreshData = await this.verifyToken(refreshToken);

			await this.revokeCurrentToken(userRefreshData.currentToken!);

			await this.refreshTokenModel.findOneAndUpdate({ refreshToken }, { revoked: true, revokedAt: +new Date() });
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
				throw new UnauthorizedException(
					`Error verifying token : Invalid Token`,
				);
			}

			if (userRefreshData.revoked) {
				throw new UnauthorizedException(
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
