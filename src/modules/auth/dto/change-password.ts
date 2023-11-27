import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: 'Password should be at least 6 characters.' })
	@MaxLength(30, { message: 'Password should not exceed 30 characters.' })
	readonly oldPassword: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: 'Password should be at least 6 characters.' })
	@MaxLength(30, { message: 'Password should not exceed 30 characters.' })
	readonly newPassword: string;
}
