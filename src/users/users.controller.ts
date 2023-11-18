import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users//users.service';

@Controller('user')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@Get(':id')
	async getUserProfile(@Param('id') id: string) {
		return await this.usersService.findById(id);
	}
}
