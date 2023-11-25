import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Patch,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';
import { RefreshJwtGuard } from 'src/auth/guards/refresh.guard';
import { Permissions, ResLoginObject, TokenObject } from 'src/auth/types';
import { User } from 'src/users/schemas/user.schema';
import { Authorize } from 'src/auth/decorators/authorize.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SignupDto } from './dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { VerifyDto } from './dto/verify.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
	) { }

	@ApiOperation({ summary: 'Login User' })
	@Authorize({
		allowedRoles: [Permissions.UNAUTHENTICATED],
	})
	@Post('login')
	async login(@Request() req, @Body() dto: CredentialsDto): Promise<ResLoginObject> {
		return await this.authService.login(dto, {
			useragent: req.headers['user-agent'],
			clientId: req.headers['x-client-id'],
			ip: req.ip,
		});
	}

	@ApiOperation({ summary: 'Request verification via Email or Phone number' })
	@Authorize({
		allowedRoles: [Permissions.EVERYONE],
	})
	@Post('request-verification')
	async requestVerification(@Body() dto: VerifyRequestDto): Promise<{ verificationKey: string }> {
		const otpData = await this.authService.requestVerification(dto);

		return {
			verificationKey: otpData.verificationKey,
		};
	}

	@ApiOperation({ summary: 'Verify the Email or Phone number' })
	@Authorize({
		allowedRoles: [Permissions.EVERYONE],
	})
	@Post('verify')
	async verify(@Body() dto: VerifyDto): Promise<User> {
		return await this.authService.verify(dto);
	}

	@ApiBearerAuth()
	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: SignupDto,
	})
	@Authorize({
		allowedRoles: [Permissions.AUTHENTICATED],
	})
	@Get('me')
	async getProfile(@Request() req): Promise<User> {
		const user = await this.authService.findById(req.currentUser.id);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	@ApiBearerAuth()
	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: SignupDto,
	})
	@Authorize({
		allowedRoles: [Permissions.AUTHENTICATED],
	})
	@Patch('update-profile')
	async updateProfile(@Request() req, @Body() dto: UpdateProfileDto): Promise<User> {
		const user = await this.authService.updateProfile(req.currentUser.id, dto);

		return user;
	}

	@ApiOperation({ summary: 'Change password' })
	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [Permissions.AUTHENTICATED],
	})
	@Patch('change-password')
	async changePassword(@Request() req, @Body() dto: ChangePasswordDto): Promise<object> {
		return await this.authService.changePassword(req.currentUser.id, dto);
	}

	@ApiOperation({ summary: 'User signup' })
	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: SignupDto,
	})
	@Authorize({
		allowedRoles: [Permissions.UNAUTHENTICATED],
	})
	@Post('signup')
	async signUp(@Body() dto: SignupDto): Promise<User> {
		return await this.authService.signup(dto);
	}

	@UseGuards(RefreshJwtGuard)
	@Post('refresh')
	async refreshToken(@Request() req): Promise<TokenObject> {
		return await this.authService.refreshToken(req);
	}

	@UseGuards(RefreshJwtGuard)
	@Post('logout')
	async logout(@Request() req): Promise<object> {
		return await this.authService.logout(req);
	}
}
