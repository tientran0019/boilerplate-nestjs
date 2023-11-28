/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-28 18:56:13

* Last updated on: 2023-11-28 18:56:13
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { NestFastifyApplication } from '@nestjs/platform-fastify';

export default async function configCors(app: NestFastifyApplication) {
	app.enableCors({
		origin: process.env.CORS_DOMAIN ? process.env.CORS_DOMAIN.split(',') : '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		maxAge: 86400,
		credentials: true,
	});
}
