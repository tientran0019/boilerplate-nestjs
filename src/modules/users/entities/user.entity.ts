import { Expose, Transform, Type } from 'class-transformer';
import { UserRole, UserStatus, UserVerificationProviders } from '@modules/users/user.enum';
import { Address } from '../schemas/address.schema';

// @Exclude()
export class UserEntity {
	readonly createdAt: number;

	readonly updatedAt: number;

	readonly fullName: string;

	readonly email: string;

	readonly role: UserRole;

	readonly status: UserStatus;

	readonly verifiedBy: UserVerificationProviders[];

	readonly lastLoginAt: number;

	@Expose({ name: 'birthDate', toPlainOnly: true })
	readonly dateOfBirth: number;

	@Type(() => Address)
	readonly address: Address[];

	@Expose()
	// makes sure that when deserializing from a Mongoose Object, ObjectId is serialized into a string
	@Transform(({ value }) => {
		if (!value) {
			return;
		}
		const lastThreeDigits = value.slice(value.length - 4);
		return `****-***-${lastThreeDigits}`;
	})
	readonly phone: string;

	// @Expose()
	// get id(): string {
	// 	return this._id.toString();
	// }

	// @Expose()
	// get username(): string {
	// 	return this.email?.split('@')[0];
	// }

	// constructor(partial: Partial<UserEntity>) {
	// 	Object.assign(this, partial);
	// }
}
