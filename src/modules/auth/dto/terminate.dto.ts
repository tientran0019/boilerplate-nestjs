import { IsNotEmpty, IsString } from 'class-validator';

export class TerminateDto {
	@IsNotEmpty()
	@IsString()
	readonly verificationKey: string;

	@IsNotEmpty()
	@IsString()
	readonly otp: string;
}
