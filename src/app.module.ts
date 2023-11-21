import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { MongooseModule } from '@nestjs/mongoose';

import redisStore from 'cache-manager-ioredis-yet';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { CoreModule } from 'src/core/core.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { MailModule } from './mail/mail.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.register({
			isGlobal: true,
			// @ts-ignore
			store: redisStore,
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			database: process.env.REDIS_DATABASE,
		}),
		MongooseModule.forRoot(process.env.MONGO_URL),
		ThrottlerModule.forRoot([{
			ttl: 60000,
			limit: 100,
		}]),
		CoreModule,
		MailModule,
		UsersModule,
		AuthModule,
		ArticlesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
