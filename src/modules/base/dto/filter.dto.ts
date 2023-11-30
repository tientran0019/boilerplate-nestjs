import { IsOptional } from 'class-validator';
import { FilterQuery } from '../decorators/filter.decorator';
import { ApiProperty } from '@nestjs/swagger';

type Query<T> = { 'filter': FilterQuery<T> }
export class FilterQueryDto<T> {
	@ApiProperty({
		example: {
			filter: {
				limit: 10,
				skip: 0,
				where: {
					field1: 'condition',
					field2: 'condition',
				},
				sort: { 'field1': 'asc', 'field2': 'desc' },
				fields: ['field1', 'field2'],
				include: ['relation1', 'relation2'],
			},
		},
	})
	@IsOptional()
	query?: Query<T>;
}

export class FindByIdQueryDto<T> {
	@ApiProperty({
		example: {
			filter: {
				fields: ['field1', 'field2'],
				include: ['relation1', 'relation2'],
			},
		},
	})
	@IsOptional()
	query?: Query<T>;
}

export class FindOneQueryDto<T> {
	@ApiProperty({
		example: {
			filter: {
				where: {
					field1: 'condition',
					field2: 'condition',
				},
				fields: ['field1', 'field2'],
				include: ['relation1', 'relation2'],
			},
		},
	})
	@IsOptional()
	query?: Query<T>;
}
