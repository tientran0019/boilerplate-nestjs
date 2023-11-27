import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';
import csrf from '@fastify/csrf-protection';
import compression from '@fastify/compress';

import { AppModule } from './app.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true }),
		{ abortOnError: false },
	);

	app.setGlobalPrefix('v1', {
		exclude: [{ path: 'health', method: RequestMethod.GET }],
	});
	app.enableVersioning();

	app.useGlobalPipes(new ValidationPipe({
		enableDebugMessages: process.env.NODE_ENV === 'development',
		/**
		* If set to true validator will strip validated object of any properties that do not have any decorators.
		*
		* Tip: if no other decorator is suitable for your property use @Allow decorator.
		*/
		whitelist: true,
		forbidNonWhitelisted: true,
		transform: true,
	}));

	app.enableCors({
		origin: process.env.CORS_DOMAIN ? process.env.CORS_DOMAIN.split(',') : '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		maxAge: 86400,
		credentials: true,
	});

	await app.register(csrf);

	await app.register(compression, { encodings: ['gzip', 'deflate'] });

	await app.register(helmet, {
		contentSecurityPolicy: {
			directives: {
				defaultSrc: [`'self'`],
				styleSrc: [`'self'`, `'unsafe-inline'`],
				imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
				scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
			},
		},
	});

	const options = new DocumentBuilder()
		.setTitle('APIs')
		.setDescription('The API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, options, {
		include: [
			UsersModule,
			AuthModule,
		],
	});
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT, process.env.HOST);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
