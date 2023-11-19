import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserProfileForToken } from './types';
import { User } from 'src/users/schemas/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AccessTokenService {
	constructor(
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private usersService: UsersService,
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
				secret: process.env.TOKEN_SECRET,
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
			await this.cacheManager.set(token, true, parseInt(process.env.TOKEN_EXPIRES_IN, 10));

			return true;
		} catch (error) {
			console.log('DEV ~ file: accesstoken.service.ts:59 ~ AccessTokenService ~ revokeToken ~ error:', error);
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
		const userInfoForToken: UserProfileForToken = this.usersService.convertToUserProfile(user);

		// Generate a JSON Web Token
		let token: string;
		try {
			token = await this.jwtService.signAsync(userInfoForToken, {
				expiresIn: process.env.TOKEN_EXPIRES_IN,
				secret: process.env.TOKEN_SECRET,
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
