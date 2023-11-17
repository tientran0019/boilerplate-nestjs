import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CredentialsDto {
	@IsNotEmpty()
	@IsEmail({}, { message: 'Please enter correct email' })
	readonly email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: 'Password should be at least 8 characters.' })
	@MaxLength(30, { message: 'Password should not exceed 30 characters.' })
	readonly password: string;
}
