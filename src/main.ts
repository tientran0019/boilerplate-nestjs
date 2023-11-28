/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-27 13:04:28

* Last updated on: 2023-11-27 13:04:28
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import configSwagger from '@configs/api-docs.config';
import configHelmet from '@configs/helmet.config';
import configCors from '@configs/cors.config';
import configCompression from '@configs/compression.config';
import configCsrf from '@configs/csrf.config';
import configVersion from '@configs/version.config';
import configGlobalPipes from '@configs/global-pipes.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
	const logger = new Logger(bootstrap.name);

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true }),
		{ abortOnError: false },
	);

	await configGlobalPipes(app);

	await configVersion(app);

	await configCsrf(app);

	await configCompression(app);

	await configCors(app);

	await configHelmet(app);

	await configSwagger(app);

	await app.listen(process.env.PORT, process.env.HOST);

	logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
