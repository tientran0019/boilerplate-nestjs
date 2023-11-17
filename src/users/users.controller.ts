import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users//users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@UseGuards(JwtGuard)
	@Get(':id')
	async getUserProfile(@Param('id') id: string) {
		return await this.usersService.findById(id);
	}
}
