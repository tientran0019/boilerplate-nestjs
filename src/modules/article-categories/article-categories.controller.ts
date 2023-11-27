import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleCategoriesService } from './article-categories.service';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';

@Controller('article-categories')
export class ArticleCategoriesController {
	constructor(private readonly articleCategoriesService: ArticleCategoriesService) { }

	@Post()
	create(@Body() createArticleCategoryDto: CreateArticleCategoryDto) {
		return this.articleCategoriesService.create(createArticleCategoryDto);
	}

	@Get()
	findAll() {
		return this.articleCategoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.articleCategoriesService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateArticleCategoryDto: UpdateArticleCategoryDto) {
		return this.articleCategoriesService.update(+id, updateArticleCategoryDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.articleCategoriesService.remove(+id);
	}
}
