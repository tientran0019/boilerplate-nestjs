import { ArticleStatus } from '@modules/articles/article.num';
import { Deleted } from '@modules/base/decorators/deleted.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsOptional, IsUrl } from 'class-validator';

export class ArticleCategoryEntity {
	@Deleted()
	readonly id: string;

	@ApiProperty({
		example: Date.now(),
	})
	@Deleted()
	readonly createdAt: number;

	@ApiProperty({
		example: Date.now(),
	})
	@Deleted()
	readonly updatedAt: number;

	@Exclude()
	readonly _isDeleted: boolean;

	@Exclude()
	readonly _deletedAt: number;

	@Deleted()
	readonly name: string;

	@Deleted()
	readonly slug: string;

	@Deleted()
	@IsEnum(ArticleStatus)
	readonly status: ArticleStatus;

	@Deleted()
	@IsUrl()
	readonly thumbnail: string;

	@Deleted()
	@IsOptional()
	readonly description: string;

	constructor(partial: Partial<ArticleCategoryEntity>) {
		Object.assign(this, partial);
	}
}
