import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';

@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
	constructor(private readonly catsService: CatsService) { }

	@Post()
	@Roles('admin')
	async create(@Body() createCatDto: CreateCatDto) {
		this.catsService.create(createCatDto);
	}

	@Get()
	async findAll(): Promise<Cat[]> {
		return this.catsService.findAll();
	}

	@Get(':id')
	async findOne(
		@Param('id', new ParseIntPipe())
		id: string,
	): Promise<Cat> {
		return this.catsService.findOne(id);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.catsService.delete(id);
	}
}
