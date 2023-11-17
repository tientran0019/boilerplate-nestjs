import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CredentialsDto } from './dto/credentials.dto';
import { compare } from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';
import { AccessTokenService } from './accesstoken.service';
import { RefreshTokenService } from './refreshtoken.service';
import { TokenObject } from './types';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private accessTokenService: AccessTokenService,
		private refreshTokenService: RefreshTokenService,
	) { }

	async login(dto: CredentialsDto) {
		const user = await this.verifyCredentials(dto);

		const token = await this.accessTokenService.generateToken(user);

		return {
			user,
			backendTokens: {
				accessToken: token,
				refreshToken: await this.refreshTokenService.generateToken(user.id, token),
				expiresIn: process.env.TOKEN_EXPIRES_IN,
			},
		};
	}

	async verifyCredentials(credentials: CredentialsDto): Promise<User> {
		const { email, password } = credentials;

		const invalidCredentialsError = 'Invalid email or password.';

		if (!email) {
			throw new UnauthorizedException(invalidCredentialsError);
		}
		const foundUser = await this.usersService.findByEmail(email);

		if (!foundUser) {
			throw new UnauthorizedException(invalidCredentialsError);
		}

		const credentialsFound = await this.usersService.findCredentials(
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
			const accessToken = this.accessTokenService.extractTokenFromHeader(req);
			const refreshToken = this.refreshTokenService.extractTokenFromHeader(req);

			if (!accessToken || !refreshToken) {
				throw new UnauthorizedException(`Error verifying token : Invalid Token`);
			}

			await this.accessTokenService.revokeToken(accessToken);

			await this.refreshTokenService.revokeToken(refreshToken);

			return {
				success: true,
			};
		} catch (err) {
			throw new InternalServerErrorException(err.message);
		}
	}
}
