import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ArticleCategoriesService } from './article-categories.service';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorize } from '@modules/auth/decorators/authorize.decorator';
import { UserRole } from '@modules/users/user.enum';
import Serializer from '@common/interceptors/mongoose-class-serializer.interceptor';
import { ArticleCategoryEntity } from './entities/article-category.entity';
import { Filter, FilterQuery, PaginatedResource } from '@common/decorators/filter.decorator';
import { RequiredValuePipe } from '@common/pipes/required.pipe';
import { Permissions } from '@modules/auth/auth.interface';

@ApiTags('Article Categories')
@UseInterceptors(Serializer(ArticleCategoryEntity))
@Controller('article-categories')
export class ArticleCategoriesController {
	constructor(private readonly articleCategoriesService: ArticleCategoriesService) { }

	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [UserRole.ADMIN],
	})
	@Post()
	create(@Body() createArticleCategoryDto: CreateArticleCategoryDto): Promise<ArticleCategoryEntity> {
		return this.articleCategoriesService.create(createArticleCategoryDto);
	}

	@Get()
	async findAll(@Filter() filter: FilterQuery<ArticleCategoryEntity>): Promise<PaginatedResource<ArticleCategoryEntity>> {
		return this.articleCategoriesService.findAll(filter);
	}

	@Get(':slug')
	async findBySlug(@Param('slug', new RequiredValuePipe()) slug: string, @Filter() filter: FilterQuery<ArticleCategoryEntity>): Promise<ArticleCategoryEntity> {
		return this.articleCategoriesService.findBySlug(slug, filter);
	}

	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [Permissions.OWNER],
	})
	@Patch(':id')
	async update(@Param('id', new RequiredValuePipe()) id: string, @Body() updateDto: UpdateArticleCategoryDto): Promise<ArticleCategoryEntity> {
		return this.articleCategoriesService.update(id, updateDto);
	}

	@ApiBearerAuth()
	@Authorize({
		allowedRoles: [Permissions.OWNER],
	})
	@Delete(':id')
	async remove(@Param('id', new RequiredValuePipe()) id: string): Promise<{ success: boolean }> {
		await this.articleCategoriesService.delete(id);

		return {
			success: true,
		};
	}
}
