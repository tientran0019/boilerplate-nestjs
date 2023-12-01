import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FastifyRequest } from 'fastify';

import { User } from '@modules/users/schemas/user.schema';

import { UserProfileForToken } from '@modules/auth/auth.interface';
import { convertToTokenProfile } from '@modules/auth/auth.utils';

@Injectable()
export class AccessTokenService {
	readonly expiresIn = process.env.TOKEN_EXPIRES_IN;
	readonly secret = process.env.TOKEN_SECRET;

	constructor(
		@Inject(CACHE_MANAGER)
		private cacheManager: Cache,
		private jwtService: JwtService,
	) { }

	async verifyToken(token: string): Promise<UserProfileForToken> {
		if (!token) {
			throw new UnauthorizedException(
				`Error verifying token : 'token' is null`,
			);
		}

		if (await this.cacheManager.get(token)) {
			throw new UnauthorizedException(
				`Error verifying token : Token is revoked`,
			);
		}

		let userProfile: UserProfileForToken;

		try {
			// decode user profile from token
			const decodedToken = await this.jwtService.verifyAsync(token, {
				secret: this.secret,
			});

			// don't copy over token field 'iat' and 'exp' to user profile
			userProfile = {
				email: decodedToken.email,
				name: decodedToken.name,
				id: decodedToken.id,
				role: decodedToken.role,
			};
		} catch (error) {
			throw new UnauthorizedException(
				`Error verifying token : ${error.message}`,
			);
		}
		return userProfile;
	}

	async revokeToken(token: string): Promise<boolean> {
		try {
			await this.cacheManager.set(token, true, parseInt(this.expiresIn, 10));

			return true;
		} catch (error) {
			// ignore
			return false;
		}
	}

	async generateToken(user: User): Promise<string> {
		if (!user) {
			throw new UnauthorizedException(
				'Error generating token : userProfile is null',
			);
		}
		const userInfoForToken: UserProfileForToken = convertToTokenProfile(user);

		// Generate a JSON Web Token
		let token: string;
		try {
			token = await this.jwtService.signAsync(userInfoForToken, {
				expiresIn: this.expiresIn,
				secret: this.secret,
			});
		} catch (error) {
			throw new UnauthorizedException(`Error encoding token : ${error}`);
		}

		return token;
	}

	extractTokenFromHeader(request: FastifyRequest) {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
