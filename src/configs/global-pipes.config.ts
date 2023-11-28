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
import { ValidationPipe } from '@nestjs/common';

export default async function configGlobalPipes(app: NestFastifyApplication) {
	app.useGlobalPipes(new ValidationPipe({
		enableDebugMessages: process.env.NODE_ENV === 'development',
		/**
		* If set to true validator will strip validated object of any properties that do not have any decorators.
		*
		* Tip: if no other decorator is suitable for your property use @Allow decorator.
		*/
		whitelist: true,
		forbidNonWhitelisted: false, // Throw the error or not
		transform: true,
	}));
}
