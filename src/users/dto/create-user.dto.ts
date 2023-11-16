import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	readonly firstName: string;

	@IsNotEmpty()
	@IsString()
	readonly lastName: string;

	@IsNotEmpty()
	@IsEmail({}, { message: 'Please enter correct email' })
	readonly email: string;

	// @Exclude()
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	readonly password: string;

	// @Expose()
	// get fullName(): string {
	// 	return `${this.firstName} ${this.lastName}`;
	// }

	// @Transform(({ value }) => ("" + value).toLowerCase())
	// @IsEnum(UserRole)
	// role: UserRole;
}
