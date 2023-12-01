import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { Model } from 'mongoose';
import { AccessTokenService } from './access-token.service';
import { ClientInfoData } from '../auth.interface';
import { FastifyRequest } from 'fastify';
import async from 'async';

@Injectable()
export class RefreshTokenService {
	readonly tokenExpiresIn = process.env.TOKEN_EXPIRES_IN;
	readonly expiresIn = process.env.REFRESH_EXPIRES_IN;
	readonly issuer = process.env.REFRESH_ISSUER;
	readonly secret = process.env.REFRESH_SECRET;

	constructor(
		@InjectModel(RefreshToken.name)
		private readonly refreshTokenModel: Model<RefreshToken>,
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
		clientInfo: ClientInfoData,
	): Promise<string> {
		const data = {
			token: uuidv4(),
		};
		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: this.expiresIn,
			issuer: this.issuer,
			secret: this.secret,
		});

		await this.refreshTokenModel.create({
			...clientInfo,
			userId,
			refreshToken,
			currentToken: token,
		});

		return refreshToken;
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

	async revokeAllToken(userId: string, exceptToken?: string): Promise<void> {
		try {
			const rfs = await this.refreshTokenModel.find({ userId, revoked: false, refreshToken: { $ne: exceptToken } }) || [];

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
			await this.jwtService.verifyAsync(refreshToken, { secret: this.secret });

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
