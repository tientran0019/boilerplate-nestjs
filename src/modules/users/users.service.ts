/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:21:03

* Last updated on: 2023-11-23 23:21:03
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';

// import omit from 'tily/object/omit';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatus } from '@modules/users/user.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UserCredentials } from '@modules/auth/schemas/user-credentials.schema';
import { AuthService } from '@modules/auth/services/auth.service';
import { MailService } from '@modules/mail/mail.service';
import { FilterQuery, PaginatedResource } from '@common/decorators/filter.decorator';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly usersModel: Model<User>,
		private authService: AuthService,
		private mailService: MailService,
	) { }

	async create(dto: CreateUserDto): Promise<User> {
		const { sendEmail, ...userData } = dto;

		const newUser = await this.authService.signup(userData);

		if (sendEmail) {
			await this.mailService.sendUserCreatedAccount({
				email: dto.email,
				fullName: dto.fullName,
				password: dto.password,
			});
		}

		return newUser;
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
		const user = await this.usersModel.findById(id);

		if (!user || user?._isDeleted) {
			throw new NotFoundException(`User #${id} not found`);
		}

		const newData = await this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true });

		return newData as UserEntity;
	}

	async findAll(filter: FilterQuery<UserEntity>): Promise<PaginatedResource<UserEntity>> {
		const { limit = 10, skip = 0, sort, fields, include, where = {} } = filter;

		const [total, items] = await Promise.all([
			this.usersModel.countDocuments({ ...where, _isDeleted: false }),
			this.usersModel.find({ ...where, _isDeleted: false }, fields || '', {
				skip,
				limit,
				sort,
			}).populate(include),
		]);
		return {
			total,
			items: items as UserEntity[],
			skip,
			limit,
		};
	}

	async findById(id: string, filter: FilterQuery<UserEntity>): Promise<UserEntity> {
		const { fields, include } = filter;

		const user = await this.usersModel.findById(id, fields || '').populate(include);

		if (!user || user?._isDeleted) {
			throw new NotFoundException(`User #${id} not found`);
		}

		return user as UserEntity;
	}

	async delete(id: string): Promise<UserEntity> {
		const deleteData = await this.usersModel.findById(id);

		if (!deleteData || deleteData?._isDeleted) {
			throw new NotFoundException(`User #${id} not found`);
		}

		deleteData.email = 'deleted___' + deleteData.email;
		deleteData.phone = 'deleted___' + deleteData.phone;
		deleteData._isDeleted = true;
		deleteData._deletedAt = Date.now();

		await deleteData.save();

		await this.authService.logoutAllSession(id);

		return deleteData as UserEntity;
	}

	async toggleActive(id: string): Promise<UserEntity> {
		const user = await this.usersModel.findById(id);

		if (!user || user?._isDeleted) {
			throw new NotFoundException(`User #${id} not found`);
		}

		const status = user.status;

		user.status = status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;

		if (status === UserStatus.ACTIVE) {
			await this.authService.logoutAllSession(id);
		}

		return await user.save() as UserEntity;
	}
}
