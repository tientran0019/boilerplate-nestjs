import { User } from '@modules/users/schemas/user.schema';
import { UserProfileForToken } from './auth.interface';

export const convertToTokenProfile = (user: User): UserProfileForToken => {
	return {
		id: user.id.toString(),
		name: user.fullName,
		email: user.email,
		role: user.role,
	};
};
