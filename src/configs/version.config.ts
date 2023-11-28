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
import { RequestMethod } from '@nestjs/common';

export default async function configVersion(app: NestFastifyApplication) {
	app.setGlobalPrefix('v1', {
		exclude: [{ path: 'health', method: RequestMethod.GET }],
	});
	app.enableVersioning();
}
