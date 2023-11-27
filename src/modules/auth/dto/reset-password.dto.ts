import { IsNotEmpty, MinLength, MaxLength, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly check: string;

	@ApiProperty({
		example: 'secret password change me!',
		description: 'The password of the User',
		format: 'string',
		minLength: 5,
		maxLength: 1024,
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	@MaxLength(1024)
	readonly password: string;

	@IsNotEmpty()
	@IsString()
	readonly verificationKey: string;

	@IsNotEmpty()
	@IsString()
	readonly otp: string;
}
