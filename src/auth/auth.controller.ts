import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private userService: UsersService,
		private authService: AuthService,
	) { }

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() dto: CredentialsDto) {
		return await this.authService.login(dto);
	  }

	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('register')
	async registerUser(@Body() dto: CreateUserDto) {
		return await this.userService.create(dto);
	}

	// @UseGuards(RefreshJwtGuard)
	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	async refreshToken(@Request() req) {
		console.log('refreshed');

		return await this.authService.refreshToken(req);
	}
}
