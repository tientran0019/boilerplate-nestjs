import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
	catch(exception: InternalServerErrorException, host: ArgumentsHost) {
		console.log('DEV ~ file: mongo-exception.filter.ts:14 ~ MongoExceptionFilter ~ exception:', exception);
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		// const request = ctx.getRequest();

		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		response.status(status).send({
			statusCode: status,
			message: exception.message,
			error: exception.name,
			stack: process.env.NODE_ENV === 'development' ? exception.stack : undefined,
		});
	}
}
