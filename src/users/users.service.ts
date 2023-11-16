import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from './schemas/user.schema';

import { hash } from 'bcrypt';
// import omit from 'tily/object/omit';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly usersModel: Model<User>
	) { }

	async create(dto: CreateUserDto) {
		const user = await this.usersModel.findOne({
			email: dto.email,
		}).exec();

		if (user) throw new ConflictException('Email duplicated');

		const newUser = await this.usersModel.create({
			...dto,
			password: await hash(dto.password, 10),
		});

		// return omit(['password'], newUser);
		return newUser;
	}

	async findByEmail(email: string) {
		return await this.usersModel.findOne({
			email: email,
		}).exec();
	}

	async findById(id: number) {
		return await this.usersModel.findById(id).exec();
	}
}
