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
import { CredentialsDto } from '@modules/auth/dto/credentials.dto';
import { RefreshJwtGuard } from '@modules/auth/guards/refresh.guard';
import { Permissions, ResLoginObject, TokenObject } from '@modules/auth/auth.interface';
import { User } from '@modules/users/schemas/user.schema';
import { Authorize } from '@modules/auth/decorators/authorize.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SignupDto } from './dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { VerifyDto } from './dto/verify.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ObjectId } from 'mongoose';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
	) { }

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@ApiOperation({ summary: 'Login User' })
	@Authorize({
		allowedRoles: [Permissions.UNAUTHENTICATED],
	})
	@Post('login')
	async login(@Request() req, @Body() dto: CredentialsDto): Promise<ResLoginObject> {
		return await this.authService.login(dto, req.clientInfo);
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

	@Throttle({ default: { limit: 3, ttl: 60000 } })
	@ApiOperation({ summary: 'Verify the Email or Phone number' })
	@Authorize({
		allowedRoles: [Permissions.EVERYONE],
	})
	@Post('verify')
	async verify(@Body() dto: VerifyDto): Promise<User> {
		return await this.authService.verify(dto);
	}

	@ApiOperation({ summary: 'Get current user profile' })
	@ApiBearerAuth()
	@ApiOkResponse({
		status: 200,
		// description: 'The found record',
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

	@ApiOperation({ summary: 'Update current user profile' })
	@ApiBearerAuth()
	@ApiOkResponse({
		status: 200,
		// description: 'The found record',
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
	@ApiOkResponse({
		status: 200,
		// description: 'The found record',
		type: SignupDto,
	})
	@Authorize({
		allowedRoles: [Permissions.UNAUTHENTICATED],
	})
	@Post('signup')
	async signUp(@Body() dto: SignupDto): Promise<User> {
		return await this.authService.signup(dto);
	}

	@Throttle({ default: { limit: 3, ttl: 60000 } })
	@ApiOperation({ summary: 'Forgot password' })
	@Authorize({
		allowedRoles: [Permissions.UNAUTHENTICATED],
	})
	@Post('forgot-password')
	async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ verificationKey: string; check: ObjectId; }> {
		return await this.authService.forgotPassword(dto);
	}

	@ApiOperation({ summary: 'Reset password' })
	@Authorize({
		allowedRoles: [Permissions.UNAUTHENTICATED],
	})
	@Patch('reset-password')
	async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ success: boolean; }> {
		return await this.authService.resetPassword(dto);
	}

	@Throttle({ default: { limit: 3, ttl: 60000 } })
	@ApiOperation({ summary: 'Refresh the access token by refresh token' })
	@UseGuards(RefreshJwtGuard)
	@Post('refresh')
	async refreshToken(@Request() req): Promise<TokenObject> {
		return await this.authService.refreshToken(req, req.clientInfo);
	}

	@ApiOperation({ summary: 'Logout' })
	@UseGuards(RefreshJwtGuard)
	@Post('logout')
	async logout(@Request() req): Promise<object> {
		return await this.authService.logout(req);
	}
}
