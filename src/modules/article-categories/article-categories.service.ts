import { Injectable } from '@nestjs/common';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';

@Injectable()
export class ArticleCategoriesService {
	create(createArticleCategoryDto: CreateArticleCategoryDto) {
		return 'This action adds a new articleCategory';
	}

	findAll() {
		return `This action returns all articleCategories`;
	}

	findOne(id: number) {
		return `This action returns a #${id} articleCategory`;
	}

	update(id: number, updateArticleCategoryDto: UpdateArticleCategoryDto) {
		return `This action updates a #${id} articleCategory`;
	}

	remove(id: number) {
		return `This action removes a #${id} articleCategory`;
	}
}
