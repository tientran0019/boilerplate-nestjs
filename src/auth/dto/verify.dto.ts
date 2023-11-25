import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { UserVerificationProviders } from 'src/constants/user.enum';

export class VerifyDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: string;

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
