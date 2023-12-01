import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString, IsUrl, MinLength } from 'class-validator';
import { ArticleStatus } from '../article.num';
import { Types } from 'mongoose';

export class CreateArticleDto {
	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsNotEmpty()
	@IsString()
	readonly slug: string;

	@IsNotEmpty()
	@IsEnum(ArticleStatus)
	readonly status: ArticleStatus;

	@IsNotEmpty()
	@IsString()
	@IsUrl()
	readonly thumbnail: string;

	@IsNotEmpty()
	@IsString()
	readonly summary: string;

	@IsNotEmpty()
	@IsString()
	readonly content: string;

	@IsNotEmpty()
	@IsArray()
	@MinLength(1)
	readonly tag: string[];

	@IsNotEmpty()
	@IsNumber()
	readonly publishedDate: number;

	@IsNotEmpty()
	@IsMongoId()
	@IsArray()
	@MinLength(1)
	readonly categories: Types.ObjectId[];
}
