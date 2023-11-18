import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from './schemas/user.schema';

import { hash } from 'bcrypt';
// import omit from 'tily/object/omit';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatus } from 'src/constants/user.enum';
import { UserCredentials } from './schemas/user-credentials.schema';
import { UserProfileForToken } from 'src/auth/types';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(UserCredentials.name)
		private readonly userCredentialsModel: Model<UserCredentials>,
		@InjectModel(User.name)
		private readonly usersModel: Model<User>
	) { }

	async create(dto: CreateUserDto): Promise<User> {
		const { password, ...userData } = dto;

		const user = await this.usersModel.findOne({
			email: dto.email,
		}).exec();

		if (user) throw new ConflictException('Email duplicated');

		const newUser = await this.usersModel.create(userData);

		await this.userCredentialsModel.create({
			password: await hash(password, 10),
			userId: newUser.id,
		});

		return newUser;
	}

	async findByEmail(email: string): Promise<User> {
		return await this.usersModel.findOne({
			email: email,
		}).exec();
	}

	async findById(id: string): Promise<User> {
		return await this.usersModel.findById(id).exec();
	}

	async findCredentials(id: string): Promise<UserCredentials> {
		return await this.userCredentialsModel.findOne({
			userId: id,
		}).exec();
	}

	verifyUserStatus(user: User): boolean {
		if (user.status !== UserStatus.ACTIVE) {
			throw new UnauthorizedException('User is inactive');
		}

		return true;
	}

	convertToUserProfile(user: User): UserProfileForToken {
		this.verifyUserStatus(user);

		return {
			id: user.id.toString(),
			name: user.fullName,
			email: user.email,
			role: user.role,
		};
	}

	async updateLastLogin(user: User): Promise<void> {
		try {
			user.lastLoginAt = +new Date();

			await user.save();
		} catch (error) {
			// ignore
		}
	}

}
