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
import { ApiBearerAuth, ApiCreatedResponse, ApiDefaultResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UsersService } from '@modules/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserEntity } from './entities/user.entity';
import Serializer from '@modules/base/interceptors/mongoose-class-serializer.interceptor';
import { Authorize } from '@modules/auth/decorators/authorize.decorator';
import { UserRole } from './user.enum';
import { ProjectionFields } from 'mongoose';
import { QueryFilterDto } from '@modules/base/dto/filter.dto';
import { Filter, FilterQuery } from '@modules/base/decorators/filter.decorator';

@ApiTags('Users Management (Only admin can use this APIs)')
@ApiBearerAuth()
@Authorize({
	allowedRoles: [UserRole.ADMIN],
})
@UseInterceptors(Serializer(UserEntity))
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@ApiOperation({
		summary: 'Admin create new user',
		description: `
		* Only admin can use this API
		* Admin create user and give some specific information
		`,
	})
	@Post()
	@ApiCreatedResponse({
		type: UserEntity,
	})
	async create(@Body() dto: CreateUserDto): Promise<User> {
		return this.usersService.create(dto);
	}

	// @SerializeOptions({
	// 	excludePrefixes: ['first', 'last'],
	// })
	@ApiOperation({
		summary: 'Admin gets all users',
		description: `
		* Only admin can use this API
		`,
	})
	@ApiQuery({
		// name: 'filter',
		required: false,
		type: QueryFilterDto<UserEntity>,
		// type: 'object',
		example: {
			'filter': {
				'sort': {
					'role': 1,
				},
			},
		},
	})
	@Get()
	async findAll(@Filter() filter): Promise<{ items: User[], total: number, limit: number, skip: number }> {
		console.log('DEV ~ file: users.controller.ts:32 ~ UsersController ~ findAll ~ filter:', filter);

		return this.usersService.findAll(filter);
	}

	@ApiOperation({
		summary: 'Admin gets user data in details',
		description: `
		* Only admin can use this API
		`,
	})
	@Get(':id')
	@ApiOkResponse({
		type: UserEntity,
	})
	async findOne(@Param('id') id: string): Promise<User> {
		const user = await this.usersService.findById(id);
		console.log('DEV ~ file: users.controller.ts:44 ~ UsersController ~ findOne ~ user:', user);

		return user;
		// return new UserEntity(user);
	}

	@ApiOperation({
		summary: 'Admin updates the user data',
		description: `
		* Only admin can use this API
		`,
	})
	// @ApiParam({
	// 	name: 'id',
	// 	type: String,
	// })
	@ApiOkResponse({
		type: UserEntity,
	})
	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateArticleDto: UpdateUserDto): Promise<User> {
		return this.usersService.update(id, updateArticleDto);
	}
}
