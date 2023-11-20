import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
	@IsNotEmpty()
	@IsString()
	readonly fullName: string;

	@IsString()
	readonly phone: string;

	@IsString()
	readonly country: string;
}
