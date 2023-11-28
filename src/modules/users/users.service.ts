/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:21:03

* Last updated on: 2023-11-23 23:21:03
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';

// import omit from 'tily/object/omit';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatus } from '@modules/users/user.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly usersModel: Model<User>
	) { }

	async findByEmail(email: string): Promise<User> {
		return await this.usersModel.findOne({
			email: email,
		}).exec();
	}

	verifyUserStatus(user: User): boolean {
		if (user.status !== UserStatus.ACTIVE) {
			throw new UnauthorizedException('User is inactive');
		}

		return true;
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const newUser = await new this.usersModel(createUserDto);
		return newUser.save();
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const existing = await this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true });
		if (!existing) {
			throw new NotFoundException(`User #${id} not found`);
		}
		return existing;
	}

	async findAll(filter: any): Promise<{ items: User[], total: number, limit: number, skip: number }> {
		const { limit, skip, where = {}, projection = {}, populate = {} } = filter;

		const total = await this.usersModel.countDocuments(where, { _id: true }).exec();

		const items = await this.usersModel.find(where, projection).limit(limit).skip(skip).populate(populate.path).lean();

		if (!items) {
			throw new NotFoundException('User items not found!');
		}

		return {
			items,
			total,
			skip,
			limit,
		};
	}

	async find(query: any): Promise< User[]> {
		const { limit, skip, filter = {} } = query;
		const data = await this.usersModel.find(filter, {}, {}).limit(limit).skip(skip).exec();
		console.log('DEV ~ file: users.service.ts:78 ~ UsersService ~ find ~ data:', data);

		if (!data) {
			throw new NotFoundException('Users data not found!');
		}

		return data;
	}

	async findById(id: string): Promise<User> {
		const existing = await this.usersModel.findById(id);

		// console.log('DEV ~ file: users.service.ts:90 ~ UsersService ~ findById ~ existing:', existing._id.toString());
		console.log('DEV ~ file: users.service.ts:90 ~ UsersService ~ findById ~ existing:', existing);
		// console.log('DEV ~ file: users.service.ts:90 ~ UsersService ~ findById ~ existing:', existing.toObject());

		if (!existing) {
			throw new NotFoundException(`User #${id} not found`);
		}

		return existing;
	}

	async delete(id: string): Promise<User> {
		const deleteData = await this.usersModel.findByIdAndDelete(id);
		if (!deleteData) {
			throw new NotFoundException(`User #${id} not found`);
		}
		return deleteData;
	}
}
