/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:23:00

* Last updated on: 2023-11-23 23:23:00
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from '@common/schemas/base.schema';
import { ArticleStatus } from '@modules/articles/article.num';

export type ArticleCategoryDocument = HydratedDocument<ArticleCategory>;

@Schema({
	timestamps: { currentTime: () => Date.now() },
	versionKey: false,
	collection: 'ArticleCategory',
	toJSON: {
		getters: true,
		virtuals: true,
		// flattenObjectIds: true,
	},
})
export class ArticleCategory extends BaseSchema {
	@Prop({
		required: true,
		index: true,
		trim: true,
	})
	name: string;

	@Prop({
		required: true,
		index: true,
		trim: true,
		unique: true,
	})
	slug: string;

	@Prop({
		enum: ArticleStatus,
		default: ArticleStatus.DRAFT,
	})
	status: ArticleStatus;

	@Prop({
		required: true,
	})
	thumbnail: string;

	@Prop()
	description: string;
}

export const ArticleCategorySchema = SchemaFactory.createForClass(ArticleCategory);
