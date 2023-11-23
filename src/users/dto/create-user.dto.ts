/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:23:21

* Last updated on: 2023-11-23 23:23:21
* Last updated by: Tien Tran
*------------------------------------------------------- */

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
	@MinLength(6, { message: 'Password should be at least 6 characters.' })
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
