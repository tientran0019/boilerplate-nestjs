import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';
import { FilterQuery, ProjectionFields } from 'mongoose';


export interface Paths {
	path: string | string[],
	select?: string | any,
	match?: any
}

export interface Filter {
	limit?: number,
	skip?: number,
	where?: object,
	projection?: object,
	populate?: Paths,
}

export class QueryFilterDto {
	@IsOptional()
	filter?: Filter;
}
