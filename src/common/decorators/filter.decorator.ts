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
	fields?: ProjectionFields<T> | string[] | string,
	include?: PopulateOptions | (PopulateOptions | string)[],
}

export type PaginatedResource<T> = {
	items: T[];
	total: number;
	skip: number;
	limit: number;
};

export const Filter = createParamDecorator(
	(data: keyof FilterQuery<Document>, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();

		// TODO: There is an error when transmitting Array of Object on Swagger
		/* {
			"filter": {
				"include": [
					{
						"path": "author",
						"select": ["fullName", "email", "phone"]
					},
					{
						"path": "categories",
						"select": ["name", "slug"]
					}
				]
			}
		}
			*/
		const filter = (
			request.query?.filter ?
				JSON.parse(request.query?.filter || '{}') :
				qs.parse(
					qs.stringify(request.query),
					{
						comma: true,
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
				).filter
		) || {};

		return data ? filter?.[data] : filter;
	},
);
