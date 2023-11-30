import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FilterQuery as IFilterQuery, Document, PopulateOptions } from 'mongoose';
import * as qs from 'qs';

type Criteria = 'asc' | 'desc' | 'ascending' | 'descending' | 1 | -1;

type ProjectionFields<DocType> = { [Key in keyof DocType]?: any } & Record<string, any>;

export interface FilterQuery<T> {
	limit?: number,
	skip?: number,
	where?: IFilterQuery<T>,
	sort?: { [field: string]: Criteria },
	fields?: ProjectionFields<T>,
	include?: PopulateOptions | (PopulateOptions | string)[],
}

export const Filter = createParamDecorator(
	(data: 'where' | 'skip' | 'fields' | 'include' | 'sort', ctx: ExecutionContext): FilterQuery<Document> => {
		const request = ctx.switchToHttp().getRequest();

		const filter = (request.query?.filter ? JSON.parse(request.query?.filter || '{}') : qs.parse(
			qs.stringify(request.query),
			{
				decoder(str: string, defaultDecoder: qs.defaultDecoder, charset: string, type: 'key' | 'value') {
					if (type === 'value' && /^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/.test(str)) {
						return parseFloat(str);
					}

					const keywords = {
						true: true,
						false: false,
						null: null,
						undefined: undefined,
					};
					if (type === 'value' && str in keywords) {
						return keywords[str];
					}

					return defaultDecoder(str, defaultDecoder, charset);
				},
			},
		).filter) || {};
		console.log('DEV ~ file: filter.decorator.ts:22 ~ request.query:', qs.parse(qs.stringify(request.query), { ignoreQueryPrefix: true }));
		console.log('DEV ~ file: filter.decorator.ts:22 ~ request.query:', request.url);
		console.log('DEV ~ file: filter.decorator.ts:22 ~ request.query:', request.query);

		return data ? filter?.[data] : filter;
	},
);
