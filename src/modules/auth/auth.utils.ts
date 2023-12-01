import { User } from '@modules/users/schemas/user.schema';
import { UserProfileForToken } from './auth.interface';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserStatus } from '@modules/users/user.enum';

export const convertToTokenProfile = (user: User): UserProfileForToken => {
	return {
		id: user.id.toString(),
		name: user.fullName,
		email: user.email,
		role: user.role,
	};
};

export const verifyUserState = (user: User): boolean => {
	if (!user || user._isDeleted) {
		throw new BadRequestException('User not found');
	}

	if (user.status !== UserStatus.ACTIVE) {
		throw new UnauthorizedException('User is inactive');
	}

	return true;
};
