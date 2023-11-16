import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { jwtConstants } from 'src/constants/jwt';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) { }

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto);

		const payload = {
			userId: user.id,
			sub: {
				name: user.firstName + ' ' + user.lastName,
				email: user.email,
				role: user.role,
			},
		};

		return {
			user,
			backendTokens: {
				accessToken: await this.jwtService.signAsync(payload, {
					expiresIn: jwtConstants.tokenExpiresIn,
					secret: jwtConstants.tokenSecret,
				}),
				refreshToken: await this.jwtService.signAsync(payload, {
					expiresIn: jwtConstants.refreshExpiresIn,
					issuer: jwtConstants.refreshIssuer,
					secret: jwtConstants.refreshSecret,
				}),
				expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
			},
		};
	}

	async validateUser(dto: LoginDto) {
		const user = await this.usersService.findByEmail(dto.email);

		if (user && (await compare(dto.password, user.password))) {
			// const { password, ...result } = user;
			return user;
		}
		throw new UnauthorizedException('Invalid email or password');
	}

	async refreshToken(user: any) {
		const payload = {
			email: user.email,
			sub: user.sub,
		};

		return {
			accessToken: await this.jwtService.signAsync(payload, {
				expiresIn: '20s',
				secret: process.env.jwtSecretKey,
			}),
			refreshToken: await this.jwtService.signAsync(payload, {
				expiresIn: '7d',
				secret: process.env.jwtRefreshTokenKey,
			}),
			expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
		};
	}
}
