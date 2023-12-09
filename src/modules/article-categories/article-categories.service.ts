import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleCategory } from './schemas/article-category.schema';
import { ArticleCategoryEntity } from './entities/article-category.entity';
import { FilterQuery, PaginatedResource } from '@common/decorators/filter.decorator';

@Injectable()
export class ArticleCategoriesService {
	constructor(
		@InjectModel(ArticleCategory.name)
		private readonly articleCategoryModel: Model<ArticleCategory>,
	) { }

	async create(createArticleCategoryDto: CreateArticleCategoryDto): Promise<ArticleCategoryEntity> {
		const data = await this.articleCategoryModel.create(createArticleCategoryDto);
		return data as ArticleCategoryEntity;
	}

	async findAll(filter: FilterQuery<ArticleCategoryEntity> = {}): Promise<PaginatedResource<ArticleCategoryEntity>> {
		const { limit = 10, skip = 0, sort, fields, include, where = {} } = filter;

		const [total, items] = await Promise.all([
			this.articleCategoryModel.countDocuments({ ...where, _isDeleted: false }),
			this.articleCategoryModel.find({ ...where, _isDeleted: false }, fields || '', {
				skip,
				limit,
				sort,
			}).populate(include),
		]);
		return {
			total,
			items: items as ArticleCategoryEntity[],
			skip,
			limit,
		};
	}

	async findById(id: string, filter: FilterQuery<ArticleCategoryEntity> = {}): Promise<ArticleCategoryEntity> {
		const { fields, include } = filter;

		const data = await this.articleCategoryModel.findById(id, fields || '').populate(include);

		if (!data || data?._isDeleted) {
			throw new NotFoundException(`Record #${id} not found`);
		}

		return data as ArticleCategoryEntity;
	}

	async findOne(filter: FilterQuery<ArticleCategoryEntity> = {}): Promise<ArticleCategoryEntity> {
		const { fields, include, where = {} } = filter;

		const data = await this.articleCategoryModel.findOne({ ...where, _isDeleted: false }, fields || '').populate(include);

		if (!data) {
			throw new NotFoundException(`Record not found`);
		}

		return data as ArticleCategoryEntity;
	}

	async findBySlug(slug: string, filter: FilterQuery<ArticleCategoryEntity> = {}): Promise<ArticleCategoryEntity> {
		const { fields, include, where = {} } = filter;

		const data = await this.articleCategoryModel.findOne({ ...where, _isDeleted: false, slug }, fields || '').populate(include);

		if (!data) {
			throw new NotFoundException(`Record not found`);
		}

		return data as ArticleCategoryEntity;
	}

	async update(id: string, updateArticleCategoryDto: UpdateArticleCategoryDto): Promise<ArticleCategoryEntity> {
		const user = await this.articleCategoryModel.findById(id);

		if (!user || user?._isDeleted) {
			throw new NotFoundException(`Record #${id} not found`);
		}

		const newData = await this.articleCategoryModel.findByIdAndUpdate(id, updateArticleCategoryDto, { new: true });

		return newData as ArticleCategoryEntity;
	}

	async delete(id: string): Promise<ArticleCategoryEntity> {
		const deleteData = await this.articleCategoryModel.findById(id);

		if (!deleteData || deleteData?._isDeleted) {
			throw new NotFoundException(`Record #${id} not found`);
		}

		deleteData._isDeleted = true;
		deleteData._deletedAt = Date.now();

		await deleteData.save();

		return deleteData as ArticleCategoryEntity;
	}
}
