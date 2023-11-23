/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:21:28

* Last updated on: 2023-11-23 23:21:28
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Controller } from '@nestjs/common';
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
