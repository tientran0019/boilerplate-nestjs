import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

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
import { OtpModule } from './otp/otp.module';
import { APP_GUARD } from '@nestjs/core';

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
