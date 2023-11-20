import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsNotEmpty()
	@IsString()
	readonly fullName: string;

	@IsString()
	readonly phone: string;

	@IsString()
	readonly country: string;
}
