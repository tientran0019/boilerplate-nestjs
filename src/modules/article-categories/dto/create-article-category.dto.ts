import { ArticleStatus } from '@modules/articles/article.num';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateArticleCategoryDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

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

	@IsOptional()
	@IsString()
	readonly description?: string;
}
