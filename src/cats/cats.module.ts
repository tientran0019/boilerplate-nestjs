import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from 'src/cats/cats.controller';
import { CatsService } from 'src/cats/cats.service';
import { Cat, CatSchema } from 'src/cats/schemas/cat.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
	controllers: [CatsController],
	providers: [CatsService],
})
export class CatsModule { }
