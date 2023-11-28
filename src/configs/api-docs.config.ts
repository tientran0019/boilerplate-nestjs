import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';

const apiDocumentationCredentials = {
	username: 'admin',
	password: 'admin',
};

export default async function configSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Nestjs project')
		.setDescription('## The API description')
		.setVersion('1.0')
		// .addSecurity('token', { type: 'http', scheme: 'bearer' })
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);

	const httpAdapter = app.getHttpAdapter();
	httpAdapter.use(
		'/api-docs',
		(req: Request, res: Response, next: NextFunction) => {
			function parseAuthHeader(input: string): { username: string; password: string } {
				const [, encodedPart] = input.split(' ');

				const buff = Buffer.from(encodedPart, 'base64');
				const text = buff.toString('ascii');
				const [username, password] = text.split(':');

				return { username, password };
			}

			function unauthorizedResponse(): void {
				if (httpAdapter.getType() === 'fastify') {
					res.statusCode = 401;
					res.setHeader('WWW-Authenticate', 'Basic');
				} else {
					res.status(401);
					res.set('WWW-Authenticate', 'Basic');
				}

				next();
			}

			if (!req.headers.authorization) {
				return unauthorizedResponse();
			}

			const credentials = parseAuthHeader(req.headers.authorization);

			if (
				credentials?.username !== apiDocumentationCredentials.username ||
				credentials?.password !== apiDocumentationCredentials.password
			) {
				return unauthorizedResponse();
			}

			next();
		},
	);
	SwaggerModule.setup('api-docs', app, document, {
		swaggerOptions: { persistAuthorization: true },
		customJs: '/swagger-custom.js',
		customSiteTitle: 'Nestjs Documents',
		customfavIcon: '/swagger.ico',
	});
}
