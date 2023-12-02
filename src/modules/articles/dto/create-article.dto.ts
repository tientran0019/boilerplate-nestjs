import { ArrayMinSize, IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MinLength, ValidateNested } from 'class-validator';
import { ArticleStatus } from '../article.num';
import { Types } from 'mongoose';
import { CreateArticleCategoryDto } from '@modules/article-categories/dto/create-article-category.dto';
import { Type } from 'class-transformer';

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
	// @IsUrl()
	readonly thumbnail: string;

	@IsNotEmpty()
	@IsString()
	readonly summary: string;

	@IsNotEmpty()
	@IsString()
	readonly content: string;

	@IsNotEmpty()
	@IsArray()
	@ArrayMinSize(1)
	readonly tag: string[];

	@IsOptional()
	@IsNumber()
	readonly publishedDate?: number;

	@IsNotEmpty()
	// @IsMongoId()
	@IsArray()
	@ArrayMinSize(1)
	// @ValidateNested({ each: true })
	// @Type(() => CreateArticleCategoryDto)
	readonly categories: Types.ObjectId[];
}
