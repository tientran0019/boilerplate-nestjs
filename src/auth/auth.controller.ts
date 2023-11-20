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
	ApiTags,
} from '@nestjs/swagger';

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
	async login(@Body() dto: CredentialsDto): Promise<ResLoginObject> {
		return await this.authService.login(dto);
	}

	@ApiBearerAuth()
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
