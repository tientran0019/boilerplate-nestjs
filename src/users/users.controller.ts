/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:21:28

* Last updated on: 2023-11-23 23:21:28
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users//users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { ObjectId } from 'mongoose';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users Management (for Amin)')
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@Post()
	async create(@Body() dto: CreateUserDto): Promise<User> {
		return this.usersService.create(dto);
	}

	@Get()
	async findAll(@Query() query): Promise<{ data: User[], total: number, limit: number, skip: number }> {
		console.log('DEV ~ file: users.controller.ts:32 ~ UsersController ~ findAll ~ query:', query);

		return this.usersService.findAll(query);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get(':id')
	async findOne(@Param('id') id: ObjectId): Promise<UserEntity> {
		const user = await this.usersService.findById(id);

		// return user;
		return new UserEntity(user.toObject());
	}

	@Patch(':id')
	async update(@Param('id') id: ObjectId, @Body() updateArticleDto: UpdateUserDto): Promise<User> {
		return this.usersService.update(id, updateArticleDto);
	}
}
