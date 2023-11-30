/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:21:28

* Last updated on: 2023-11-23 23:21:28
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Body, Controller, DefaultValuePipe, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@modules/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserEntity } from './entities/user.entity';
import Serializer from '@modules/base/interceptors/mongoose-class-serializer.interceptor';
import { Authorize } from '@modules/auth/decorators/authorize.decorator';
import { UserRole } from './user.enum';
import { FilterQueryDto, FindByIdQueryDto } from '@modules/base/dto/filter.dto';
import { Filter, FilterQuery, PaginatedResource } from '@modules/base/decorators/filter.decorator';
import { RequiredValuePipe } from '@modules/base/pipes/required.pipe';

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
		required: false,
		description: 'Filter Query object',
		explode: true,
		type: FilterQueryDto<UserEntity>,
	})
	@Get()
	async findAll(@Filter() filter: FilterQuery<UserEntity>): Promise<PaginatedResource<UserEntity>> {
		// TODO: @Query('filter', new ParseFilterPipe()) filter: FilterDto
		// để tận dụng được việc valide của dto
		return this.usersService.findAll(filter);
	}

	@ApiOperation({
		summary: 'Admin gets user data in details',
		description: `
		* Only admin can use this API
		`,
	})
	@ApiQuery({
		required: false,
		description: 'Filter Query object',
		explode: true,
		type: FindByIdQueryDto<UserEntity>,
	})
	@ApiOkResponse({
		type: UserEntity,
	})
	@Get(':id')
	async findById(@Param('id', new RequiredValuePipe()) id: string, @Filter() filter: FilterQuery<UserEntity>): Promise<UserEntity> {
		return await this.usersService.findById(id, filter);
	}

	@ApiOperation({
		summary: 'Admin updates the user data',
		description: `
		* Only admin can use this API
		`,
	})
	@ApiOkResponse({
		type: UserEntity,
	})
	@Patch(':id')
	async update(@Param('id', new RequiredValuePipe()) id: string, @Body() updateDto: UpdateUserDto): Promise<User> {
		return this.usersService.update(id, updateDto);
	}


	@ApiOperation({
		summary: 'Admin deletes the user data',
		description: `
		* Only admin can use this API
		`,
	})
	@ApiOkResponse({
		type: UserEntity,
	})
	@Delete(':id')
	async delete(@Param('id', new RequiredValuePipe()) id: string): Promise<User> {
		return this.usersService.delete(id);
	}
}
