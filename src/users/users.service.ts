/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:21:03

* Last updated on: 2023-11-23 23:21:03
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';

// import omit from 'tily/object/omit';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatus } from 'src/constants/user.enum';

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

	async findById(id: string): Promise<User> {
		return await this.usersModel.findById(id).exec();
	}

	verifyUserStatus(user: User): boolean {
		if (user.status !== UserStatus.ACTIVE) {
			throw new UnauthorizedException('User is inactive');
		}

		return true;
	}
}
