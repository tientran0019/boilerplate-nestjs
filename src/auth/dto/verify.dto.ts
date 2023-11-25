import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { UserVerificationProviders } from 'src/users/user.enum';

export class VerifyDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly check: string;

	@IsNotEmpty()
	@IsString()
	readonly otp: string;

	@IsNotEmpty()
	@IsString()
	readonly verificationKey: string;

	@IsNotEmpty()
	@IsString()
	@IsEnum(UserVerificationProviders)
	readonly type: string;
}
