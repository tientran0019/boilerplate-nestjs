import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './schemas/article.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleEntity } from './entities/article.entity';
import { FilterQuery, PaginatedResource } from '@modules/base/decorators/filter.decorator';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectModel(Article.name)
		private readonly articleModel: Model<Article>,
	) { }

	async create(data: CreateArticleDto & { author: string }): Promise<Article> {
		const item = await this.articleModel.create(data);

		return item;
	}

	async findAll(filter: FilterQuery<Article> = {}): Promise<PaginatedResource<Article>> {
		const { limit = 10, skip = 0, sort, fields, include, where = {} } = filter;

		const [total, items] = await Promise.all([
			this.articleModel.countDocuments({ ...where, _isDeleted: false }),
			this.articleModel.find({ ...where, _isDeleted: false }, fields || '', {
				skip,
				limit,
				sort,
			}).populate(include),
		]);

		return {
			total,
			items: items as Article[],
			skip,
			limit,
		};
	}

	async findById(id: string, filter: FilterQuery<Article> = {}): Promise<Article> {
		const { fields, include } = filter;

		const data = await this.articleModel.findById(id, fields || '').populate(include);

		if (!data || data?._isDeleted) {
			throw new NotFoundException(`Record #${id} not found`);
		}

		return data as Article;
	}

	async findOne(filter: FilterQuery<Article> = {}): Promise<Article> {
		const { fields, include, where = {} } = filter;

		const data = await this.articleModel.findOne({ ...where, _isDeleted: false }, fields || '').populate(include);

		if (!data) {
			throw new NotFoundException(`Record not found`);
		}

		return data as Article;
	}

	async findBySlug(slug: string, filter: FilterQuery<Article> = {}): Promise<Article> {
		const { fields, include } = filter;
		console.log('DEV ~ file: articles.service.ts:72 ~ ArticlesService ~ findBySlug ~ include:', include);

		const data = await this.articleModel.findOne({ _isDeleted: false, slug }, fields || '').populate(include);

		if (!data) {
			throw new NotFoundException(`Record not found`);
		}

		return data as Article;
	}

	async update(id: string, updateArticleDto: UpdateArticleDto & { updatedBy: string }): Promise<Article> {
		const user = await this.articleModel.findById(id);

		if (!user || user?._isDeleted) {
			throw new NotFoundException(`Record #${id} not found`);
		}

		const newData = await this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true });

		return newData as Article;
	}

	async delete(id: string, userId?: string): Promise<Article> {
		const deleteData = await this.articleModel.findById(id);

		if (!deleteData || deleteData?._isDeleted) {
			throw new NotFoundException(`Record #${id} not found`);
		}

		deleteData._isDeleted = true;
		deleteData._deletedAt = Date.now();
		deleteData._deletedBy = userId;

		await deleteData.save();

		return deleteData as Article;
	}
}
