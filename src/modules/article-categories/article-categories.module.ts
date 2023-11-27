import { Module } from '@nestjs/common';
import { ArticleCategoriesService } from './article-categories.service';
import { ArticleCategoriesController } from './article-categories.controller';

@Module({
	controllers: [ArticleCategoriesController],
	providers: [ArticleCategoriesService],
})
export class ArticleCategoriesModule { }
