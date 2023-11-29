import { Expose, Transform, Type } from 'class-transformer';
import { UserRole, UserStatus, UserVerificationProviders } from '@modules/users/user.enum';
import { Address } from '../schemas/address.schema';
import { ApiProperty } from '@nestjs/swagger';

// @Exclude()
export class UserEntity {
	readonly id: string;

	@ApiProperty({
		example: Date.now(),
	})
	readonly createdAt: number;

	@ApiProperty({
		example: Date.now(),
	})
	readonly updatedAt: number;

	readonly fullName: string;

	readonly email: string;

	readonly role: UserRole;

	readonly status: UserStatus;

	readonly verifiedBy: UserVerificationProviders[];

	@ApiProperty({
		example: Date.now(),
	})
	readonly lastLoginAt: number;

	// @Expose({ name: 'birthDate', toPlainOnly: true })
	@ApiProperty({
		example: Date.now(),
	})
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
}
