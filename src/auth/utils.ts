import { User } from 'src/users/schemas/user.schema';
import { UserProfileForToken } from './types';

export const convertToTokenProfile = (user: User): UserProfileForToken => {
	return {
		id: user.id.toString(),
		name: user.fullName,
		email: user.email,
		role: user.role,
	};
};
