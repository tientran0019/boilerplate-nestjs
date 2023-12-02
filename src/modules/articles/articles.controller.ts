import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import Serializer from '@modules/base/interceptors/mongoose-class-serializer.interceptor';
import { ArticleEntity } from './entities/article.entity';
import { UserRole } from '@modules/users/user.enum';
import { Authorize } from '@modules/auth/decorators/authorize.decorator';
import { Filter, FilterQuery, PaginatedResource } from '@modules/base/decorators/filter.decorator';
import { RequiredValuePipe } from '@modules/base/pipes/required.pipe';
import { Permissions } from '@modules/auth/auth.interface';
import { Article } from './schemas/article.schema';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { FilterQueryDto, FindByIdQueryDto } from '@modules/base/dto/filter.dto';

@ApiTags('Articles')
@UseInterceptors(Serializer(ArticleEntity))
@Controller('articles')
export class ArticlesController {
	constructor(private readonly articleService: ArticlesService) { }

	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [UserRole.ADMIN],
	})
	@Post()
	create(@Body() createArticleDto: CreateArticleDto, @CurrentUser('id', new RequiredValuePipe()) userId: string) {
		return this.articleService.create({ ...createArticleDto, author: userId });
	}

	@ApiQuery({
		required: false,
		description: 'Filter Query object',
		explode: true,
		type: FilterQueryDto<Article>,
	})
	@Get()
	async findAll(@Filter() filter: FilterQuery<Article>): Promise<PaginatedResource<Article>> {
		return this.articleService.findAll(filter);
	}

	@ApiQuery({
		required: false,
		description: 'Filter Query object',
		explode: true,
		type: FindByIdQueryDto<Article>,
	})
	@Get(':slug')
	async findBySlug(@Param('slug', new RequiredValuePipe()) slug: string, @Filter() filter: FilterQuery<Article>): Promise<Article> {
		return this.articleService.findBySlug(slug, filter);
	}

	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [UserRole.ADMIN],
	})
	@Patch(':id')
	async update(@Param('id', new RequiredValuePipe()) id: string, @Body() updateDto: UpdateArticleDto, @CurrentUser('id', new RequiredValuePipe()) userId: string): Promise<Article> {
		return this.articleService.update(id, { ...updateDto, updatedBy: userId });
	}

	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [UserRole.ADMIN],
	})
	@Delete(':id')
	async remove(
		@Param('id', new RequiredValuePipe()) id: string,
		@CurrentUser('id', new RequiredValuePipe()) userId: string,
	): Promise<{ success: boolean }> {
		await this.articleService.delete(id, userId);

		return {
			success: true,
		};
	}
}
