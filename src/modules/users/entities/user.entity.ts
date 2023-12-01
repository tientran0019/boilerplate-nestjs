import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserRole, UserStatus, UserVerificationProviders } from '@modules/users/user.enum';
import { Address } from '../schemas/address.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Deleted } from '@modules/base/decorators/deleted.decorator';

// @Exclude()
export class UserEntity {
	@Deleted()
	readonly id: string;

	@ApiProperty({
		example: Date.now(),
	})
	@Deleted()
	readonly createdAt: number;

	@ApiProperty({
		example: Date.now(),
	})
	@Deleted()
	readonly updatedAt: number;

	@Exclude()
	readonly _isDeleted: boolean;

	@Exclude()
	readonly _deletedAt: number;

	@Deleted()
	readonly fullName: string;

	@Deleted()
	readonly email: string;

	@Deleted()
	readonly gender: string;

	@Deleted()
	readonly role: UserRole;

	@Deleted()
	readonly status: UserStatus;

	@Deleted()
	readonly verifiedBy: UserVerificationProviders[];

	@Deleted()
	@ApiProperty({
		example: Date.now(),
	})
	readonly lastLoginAt: number;

	// @Expose({ name: 'birthDate', toPlainOnly: true })
	@Deleted()
	@ApiProperty({
		example: Date.now(),
	})
	readonly dateOfBirth: number;

	@Deleted()
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
	@Deleted()
	readonly phone: string;

	// @Expose()
	// get id(): string {
	// 	return this._id.toString();
	// }

	// @Expose()
	// get username(): string {
	// 	return this.email?.split('@')[0];
	// }
}
