import { SignupDto } from './signup.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateProfileDto extends PartialType(
	OmitType(SignupDto, ['email', 'password'] as const),
) { }
