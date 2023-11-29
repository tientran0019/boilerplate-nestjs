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
import { FilterQuery, Model } from 'mongoose';
import { UserStatus } from '@modules/users/user.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UserCredentials } from '@modules/auth/schemas/user-credentials.schema';
import { AuthService } from '@modules/auth/services/auth.service';
import { MailService } from '@modules/mail/mail.service';

export type FindAllResponse<T> = {
	total: number;
	limit: number;
	skip: number;
	items: T[];
};

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly usersModel: Model<User>,
		private authService: AuthService,
		private mailService: MailService,
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

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const existing = await this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true });
		if (!existing) {
			throw new NotFoundException(`User #${id} not found`);
		}
		return existing;
	}

	// async findAll(filter: any): Promise<{ items: User[], total: number, limit: number, skip: number }> {
	// 	const { limit, skip, where = {}, projection = {}, populate = {} } = filter;

	// 	const total = await this.usersModel.countDocuments(where, { _id: true }).exec();

	// 	const items = await this.usersModel.find(where, projection).limit(limit).skip(skip).populate(populate.path).lean();

	// 	if (!items) {
	// 		throw new NotFoundException('User items not found!');
	// 	}

	// 	return {
	// 		items,
	// 		total,
	// 		skip,
	// 		limit,
	// 	};
	// }


	async findAll(
		filters: {
			where: FilterQuery<User>,
			fields?: string;
			populate?: string | string[]; // | PopulateOptions | PopulateOptions[];
			skip?: number;
			limit?: number;
			sort?: object;
		},
	): Promise<FindAllResponse<User>> {
		console.log('DEV ~ file: users.service.ts:92 ~ UsersService ~ filters:', filters);
		const { limit = 10, skip = 0, sort = {} } = filters;

		const [total, items] = await Promise.all([
			this.usersModel.countDocuments({ ...filters.where, _isDeleted: false }),
			this.usersModel.find({ ...filters.where, _isDeleted: false }, filters?.fields || '', {
				skip,
				limit,
				sort,
			}).populate(filters.populate),
		]);
		return {
			total,
			items,
			skip,
			limit,
		};
	}

	async find(query: any): Promise<User[]> {
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
		const deleteData = await this.usersModel.findByIdAndUpdate(id, { _isDeleted: true, _deletedAt: Date.now() });
		if (!deleteData) {
			throw new NotFoundException(`User #${id} not found`);
		}
		return deleteData;
	}
}
