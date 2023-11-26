/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:21:28

* Last updated on: 2023-11-23 23:21:28
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users//users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { ObjectId } from 'mongoose';

@ApiTags('Users Management (for Amin)')
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@Post()
	async create(@Body() dto: CreateUserDto): Promise<User> {
		return this.usersService.create(dto);
	}

	@Get()
	async findAll(@Query() query): Promise<User[]> {
		console.log('DEV ~ file: users.controller.ts:32 ~ UsersController ~ findAll ~ query:', query);

		return this.usersService.findAll(query);
	}

	@Get(':id')
	async findOne(@Param('id') id: ObjectId): Promise<User> {
		return this.usersService.findById(id);
	}

	@Patch(':id')
	async update(@Param('id') id: ObjectId, @Body() updateArticleDto: UpdateUserDto): Promise<User> {
		return this.usersService.update(id, updateArticleDto);
	}
}
