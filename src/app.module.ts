import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { CatsModule } from 'src/cats/cats.module';
import { CoreModule } from 'src/core/core.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		ThrottlerModule.forRoot([{
			ttl: 60000,
			limit: 100,
		}]),
		CatsModule,
		CoreModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
