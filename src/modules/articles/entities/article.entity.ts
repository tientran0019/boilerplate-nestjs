import { Deleted } from '@common/decorators/deleted.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsUrl } from 'class-validator';
import { ArticleStatus } from '../article.num';
import { User } from '@modules/users/schemas/user.schema';
import { ArticleCategory } from '@modules/article-categories/schemas/article-category.schema';

export class ArticleEntity {
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

	@ApiProperty({
		example: Date.now(),
	})
	@Deleted()
	readonly publishedDate: number;

	@Exclude()
	readonly _isDeleted: boolean;

	@Exclude()
	readonly _deletedAt: number;

	@Deleted()
	readonly title: string;

	@Deleted()
	readonly slug: string;

	@Deleted()
	@IsEnum(ArticleStatus)
	readonly status: ArticleStatus;

	@Deleted()
	@IsUrl()
	readonly thumbnail: string;

	@Deleted()
	readonly summary: string;

	@Deleted()
	readonly content: string;

	@Deleted()
	readonly tag: string[];

	// @Deleted()
	// @Type(() => User)
	// readonly author: User;

	// @Deleted()
	// @Type(() => ArticleCategory)
	// readonly categories: ArticleCategory[];

	constructor(partial: Partial<ArticleEntity>) {
		Object.assign(this, partial);
	}
}
