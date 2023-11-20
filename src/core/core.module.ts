import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { MongooseExceptionFilter } from './filters/mongoose-exception.filter';

@Module({
	providers: [
		{ provide: APP_FILTER, useClass: MongooseExceptionFilter },
		// { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor },
		// { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
	],
})
export class CoreModule { }
