import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { UserVerificationProviders } from 'src/constants/user.enum';

export class VerifyRequestDto {
	@IsNotEmpty()
	@IsMongoId()
	readonly userId: string;

	@IsNotEmpty()
	@IsString()
	@IsEnum(UserVerificationProviders)
	readonly type: string;
}
