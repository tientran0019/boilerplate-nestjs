import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { UserVerificationProviders } from 'src/users/user.enum';

export class VerifyRequestDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly check: string;

	@IsNotEmpty()
	@IsString()
	@IsEnum(UserVerificationProviders)
	readonly type: string;
}
