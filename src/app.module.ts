/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-27 13:04:38

* Last updated on: 2023-11-27 13:04:38
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';

import redisStore from 'cache-manager-ioredis-yet';
import { CacheModule } from '@nestjs/cache-manager';

import { CoreModule } from '@modules/base/core.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ArticlesModule } from '@modules/articles/articles.module';
import { MailModule } from '@modules/mail/mail.module';
import { OtpModule } from '@modules/otp/otp.module';
import { ArticleCategoriesModule } from '@modules/article-categories/article-categories.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
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
		ThrottlerModule.forRoot([
			{
				name: 'short',
				ttl: 1000,
				limit: 3,
			},
			{
				name: 'medium',
				ttl: 10000,
				limit: 100,
			},
			{
				name: 'long',
				ttl: 60000,
				limit: 1000,
			},
		]),
		CoreModule,
		MailModule,
		UsersModule,
		AuthModule,
		OtpModule,
		ArticlesModule,
		ArticleCategoriesModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule { }
