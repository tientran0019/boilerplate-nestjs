import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CredentialsDto } from '@modules/auth/dto/credentials.dto';
import { RefreshJwtGuard } from '@modules/auth/guards/refresh.guard';
import { ClientInfoData, Permissions, ResLoginObject, TokenObject, UserProfileForToken } from '@modules/auth/auth.interface';
import { User } from '@modules/users/schemas/user.schema';
import { Authorize } from '@modules/auth/decorators/authorize.decorator';

import {
	ApiBearerAuth,
	ApiOperation,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import Serializer from '@common/interceptors/mongoose-class-serializer.interceptor';
import { RequiredValuePipe } from '@common/pipes/required.pipe';
import { UserEntity } from '@modules/users/entities/user.entity';
import { UserRole } from '@modules/users/user.enum';

import { VerifyDto } from './dto/verify.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { ClientInfo } from './decorators/client-info.decorator';
import { Token } from './decorators/token.decorator';
import { TerminateDto } from './dto/terminate.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SignupDto } from './dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password';

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
	@UseInterceptors(Serializer(UserEntity))
	@Post('login')
	async login(@ClientInfo() clientInfo: ClientInfoData, @Body() dto: CredentialsDto): Promise<ResLoginObject> {
		return await this.authService.login(dto, clientInfo);
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
	@UseInterceptors(Serializer(UserEntity))
	@Post('verify')
	async verify(@Body() dto: VerifyDto): Promise<User> {
		return await this.authService.verify(dto);
	}

	@ApiOperation({ summary: 'Get current user profile' })
	@ApiBearerAuth()
	@ApiOkResponse({
		status: 200,
		// description: 'The found record',
		type: UserEntity,
	})
	@Authorize({
		allowedRoles: [Permissions.AUTHENTICATED],
	})
	@UseInterceptors(Serializer(UserEntity))
	@Get('me')
	async getProfile(@CurrentUser() currentUser: UserProfileForToken): Promise<User> {
		const user = await this.authService.findById(currentUser.id);

		return user;
	}

	@ApiOperation({ summary: 'Update current user profile' })
	@ApiBearerAuth()
	@ApiOkResponse({
		type: UserEntity,
	})
	@Authorize({
		allowedRoles: [Permissions.AUTHENTICATED],
	})
	@UseInterceptors(Serializer(UserEntity))
	@Patch('update-profile')
	async updateProfile(@CurrentUser() currentUser: UserProfileForToken, @Body() dto: UpdateProfileDto): Promise<User> {
		const user = await this.authService.updateProfile(currentUser.id, dto);

		return user;
	}

	@ApiOperation({ summary: 'Change password' })
	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [Permissions.AUTHENTICATED],
	})
	@Patch('change-password')
	async changePassword(@CurrentUser() currentUser: UserProfileForToken, @Body() dto: ChangePasswordDto): Promise<{ success: boolean }> {
		await this.authService.changePassword(currentUser.id, dto);

		return {
			success: true,
		};
	}

	@ApiOperation({ summary: 'User signup' })
	@ApiOkResponse({
		type: UserEntity,
	})
	@Authorize({
		allowedRoles: [Permissions.UNAUTHENTICATED],
	})
	@UseInterceptors(Serializer(UserEntity))
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
	async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ verificationKey: string; check: string; }> {
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
	async refreshToken(@Token('Refresh') refreshToken: string | undefined, @ClientInfo() clientInfo: ClientInfoData): Promise<TokenObject> {
		return await this.authService.refreshToken(refreshToken, clientInfo);
	}

	@ApiOperation({ summary: 'Logout' })
	@UseGuards(RefreshJwtGuard)
	@Post('logout')
	async logout(@Token('Refresh') refreshToken: string | undefined): Promise<{ success: boolean; }> {
		await this.authService.logout(refreshToken);

		return {
			success: true,
		};
	}

	@Throttle({ default: { limit: 1, ttl: 60000 } })
	@ApiOperation({ summary: 'Request deletion of the user account and all related data' })
	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [UserRole.USER],
	})
	@Post('terminate-request')
	async terminateRequest(@CurrentUser('id', new RequiredValuePipe()) userId: string): Promise<{ verificationKey: string; }> {
		const verificationKey = await this.authService.terminateRequest(userId);

		return {
			verificationKey,
		};
	}

	@Throttle({ default: { limit: 3, ttl: 60000 } })
	@ApiOperation({ summary: 'Confirm deletion of the user account and all related data' })
	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [UserRole.USER],
	})
	@Delete('terminate')
	async terminate(@CurrentUser('id', new RequiredValuePipe()) userId: string, dto: TerminateDto): Promise<{ success: boolean; }> {
		await this.authService.terminate(userId, dto);

		return {
			success: true,
		};
	}
}
