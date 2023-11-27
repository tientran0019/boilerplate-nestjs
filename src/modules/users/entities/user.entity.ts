import { Exclude, Expose } from 'class-transformer';
import { UserRole, UserStatus, UserVerificationProviders } from '@modules/users/user.enum';
import { Address } from '../schemas/address.schema';

export class UserEntity {
	readonly createdAt: number;

	readonly updatedAt: number;

	readonly fullName: string;

	readonly email: string;

	readonly phone: string;

	readonly role: UserRole;

	readonly status: UserStatus;

	readonly country: string;

	readonly verifiedBy: UserVerificationProviders[];

	readonly lastLoginAt: number;

	readonly address: Address[];

	// @Expose()
	// // makes sure that when deserializing from a Mongoose Object, ObjectId is serialized into a string
	// @Transform((value) => {
	// 	if ('value' in value) {
	// 		// HACK: this is changed because of https://github.com/typestack/class-transformer/issues/879
	// 		// return value.value.toString(); // because "toString" is also a wrapper for "toHexString"
	// 		return value.obj[value.key].toString();
	// 	}

	// 	return 'unknown value';
	// })
	// public _id: string;

	@Exclude()
	_id: string;

	@Expose()
	get id(): string {
		return this._id.toString();
	}

	@Expose()
	get username(): string {
		return this.email?.split('@')[0];
	}

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
