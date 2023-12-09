import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseExceptionFilter } from './filters/mongoose-exception.filter';

@Module({
	providers: [
		{ provide: APP_FILTER, useClass: MongooseExceptionFilter },
		// { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
		// { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
		// { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
	],
})
export class CoreModule { }
