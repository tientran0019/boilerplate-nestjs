import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateAddressDto {
	@IsOptional()
	@MinLength(2)
	@MaxLength(120)
	street?: string;

	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(50)
	state: string;

	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(50)
	city: string;

	@IsOptional()
	@IsNumber()
	// @IsPostalCode()
	postalCode?: number;

	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(50)
	country: string;
}
