import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from 'src/users//users.service';

@Controller('user')
export class UsersController {
	constructor(private usersService: UsersService) { }

	// @Get(':id')
	// async getUserProfile(@Param('id') id: string) {
	// 	const user = await this.usersService.findById(id);

	// 	if (!user) {
	// 		throw new NotFoundException('User not found');
	// 	}
	// 	return user;
	// }
}
