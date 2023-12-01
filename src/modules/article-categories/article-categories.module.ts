import { Module } from '@nestjs/common';
import { ArticleCategoriesService } from './article-categories.service';
import { ArticleCategoriesController } from './article-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleCategory, ArticleCategorySchema } from './schemas/article-category.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: ArticleCategory.name, schema: ArticleCategorySchema },
		]),
	],
	controllers: [ArticleCategoriesController],
	providers: [ArticleCategoriesService],
})
export class ArticleCategoriesModule { }
