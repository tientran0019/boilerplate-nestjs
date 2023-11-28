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

import helmet from '@fastify/helmet';


export default async function configHelmet(app: NestFastifyApplication) {
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
}
