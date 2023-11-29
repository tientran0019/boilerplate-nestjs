/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:23:21

* Last updated on: 2023-11-23 23:23:21
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';
import { UserGender, UserRole } from '../user.enum';

export class CreateUserDto {
	@IsOptional()
	@IsBoolean()
	readonly sendEmail: boolean;

	@IsNotEmpty()
	@IsString()
	readonly fullName: string;

	@IsNotEmpty()
	@IsEmail({}, { message: 'Please enter correct email' })
	readonly email!: string;

	@IsNotEmpty()
	@IsString()
	// @IsStrongPassword()
	readonly password!: string;

	@IsOptional()
	@IsString()
	readonly phone?: string;

	@IsString()
	@IsOptional()
	@IsEnum(UserGender)
	readonly gender?: UserGender;

	@IsString()
	@IsOptional()
	@IsEnum(UserRole)
	readonly role?: UserRole;

	@IsOptional()
	dateOfBirth?: number;

	@IsOptional()
	@IsArray()
	// @ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateAddressDto)
	address?: CreateAddressDto[];

	// @Transform(({ value }) => ("" + value).toLowerCase())
	// @IsEnum(UserRole)
	// role: UserRole;
}
