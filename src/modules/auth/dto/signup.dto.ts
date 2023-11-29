import { CreateAddressDto } from '@modules/users/dto/create-address.dto';
import { UserGender } from '@modules/users/user.enum';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

export class SignupDto {
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

	@IsOptional()
	@IsString()
	readonly phone?: string;

	@IsString()
	@IsOptional()
	@IsEnum(UserGender)
	readonly gender?: UserGender;

	@IsOptional()
	dateOfBirth?: number;

	@IsOptional()
	@IsArray()
	// @ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateAddressDto)
	address?: CreateAddressDto[];
}
