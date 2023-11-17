import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	readonly fullName: string;

	@IsNotEmpty()
	@IsEmail({}, { message: 'Please enter correct email' })
	readonly email: string;

	// @Exclude()
	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: 'Password should be at least 8 characters.' })
	@MaxLength(30, { message: 'Password should not exceed 30 characters.' })
	readonly password: string;

	@IsString()
	readonly phone: string;

	@IsString()
	readonly country: string;

	// @Expose()
	// get fullName(): string {
	// 	return `${this.firstName} ${this.lastName}`;
	// }

	// @Transform(({ value }) => ("" + value).toLowerCase())
	// @IsEnum(UserRole)
	// role: UserRole;
}
