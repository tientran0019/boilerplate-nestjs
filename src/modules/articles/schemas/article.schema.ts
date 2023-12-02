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
import { HydratedDocument, Types } from 'mongoose';
import { BaseSchema } from '@modules/base/schemas/base.schema';
import { User } from '@modules/users/schemas/user.schema';
import { ArticleCategory } from '@modules/article-categories/schemas/article-category.schema';
import { ArticleStatus } from '../article.num';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({
	timestamps: { currentTime: () => Date.now() },
	versionKey: false,
	collection: 'Article',
	toJSON: {
		getters: true,
		virtuals: true,
		// flattenObjectIds: true,
	},
})
export class Article extends BaseSchema {
	@Prop({
		required: true,
		index: true,
		trim: true,
	})
	title: string;

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

	@Prop({
		required: true,
	})
	summary: string;

	@Prop({
		required: true,
	})
	content: string;

	@Prop({
		default: [],
	})
	tag: string[];

	@Prop({
		match: /^\d{13}$/,
	})
	publishedDate: number;

	@Prop({
		ref: User.name,
		required: true,
		type: Types.ObjectId,
	})
	author: Types.ObjectId;

	@Prop({
		ref: ArticleCategory.name,
		required: true,
		type: Types.ObjectId,
	})
	categories: Types.ObjectId[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
