import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import Serializer from '@modules/base/interceptors/mongoose-class-serializer.interceptor';
import { ArticleEntity } from './entities/article.entity';
import { UserRole } from '@modules/users/user.enum';
import { Authorize } from '@modules/auth/decorators/authorize.decorator';
import { Filter, FilterQuery, PaginatedResource } from '@modules/base/decorators/filter.decorator';
import { RequiredValuePipe } from '@modules/base/pipes/required.pipe';
import { Permissions } from '@modules/auth/auth.interface';

@ApiTags('Articles')
@UseInterceptors(Serializer(ArticleEntity))
@Controller('articles')
export class ArticlesController {
	constructor(private readonly articleService: ArticlesService) { }

	@Authorize({
		allowedRoles: [UserRole.ADMIN],
	})
	@Post()
	create(@Body() createArticleDto: CreateArticleDto) {
		return this.articleService.create(createArticleDto);
	}

	@Get()
	async findAll(@Filter() filter: FilterQuery<ArticleEntity>): Promise<PaginatedResource<ArticleEntity>> {
		return this.articleService.findAll(filter);
	}

	@Get(':slug')
	async findBySlug(@Param('slug', new RequiredValuePipe()) slug: string, @Filter() filter: FilterQuery<ArticleEntity>): Promise<ArticleEntity> {
		return this.articleService.findBySlug(slug, filter);
	}

	@Authorize({
		allowedRoles: [Permissions.OWNER],
	})
	@Patch(':id')
	async update(@Param('id', new RequiredValuePipe()) id: string, @Body() updateDto: UpdateArticleDto): Promise<ArticleEntity> {
		return this.articleService.update(id, updateDto);
	}

	@Authorize({
		allowedRoles: [Permissions.OWNER],
	})
	@Delete(':id')
	async remove(@Param('id', new RequiredValuePipe()) id: string): Promise<{ success: boolean }> {
		await this.articleService.delete(id);

		return {
			success: true,
		};
	}
}
