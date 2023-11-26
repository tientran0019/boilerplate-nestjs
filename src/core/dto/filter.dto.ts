import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class FilterMessageDto {
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	limit?: number = 10;


	@IsOptional()
	@IsInt()
	@Type(() => Number)
	skip?: number = 0;
}
