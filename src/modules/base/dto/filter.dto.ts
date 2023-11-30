import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';
import { FilterQuery } from '../decorators/filter.decorator';
import { ApiProperty } from '@nestjs/swagger';


export class QueryFilterDto<T> {
	// @ApiProperty({
	// 	// example: FilterQuery<T>,
	// 	format: 'string',
	// })
	@IsOptional()
	filter?: FilterQuery<T>;
}
