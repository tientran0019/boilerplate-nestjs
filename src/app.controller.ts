/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-14 23:54:18

* Last updated on: 2023-11-14 23:54:18
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Controller, Get, Headers, Request } from '@nestjs/common';
import { AppService } from './app.service';

import { FastifyRequest } from 'fastify';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { UserRole } from '@modules/users/user.enum';
import { Public } from '@modules/auth/decorators/public.decorator';
import { Authorize } from '@modules/auth/decorators/authorize.decorator';
import { Permissions, RequestWithAuth } from '@modules/auth/auth.interface';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
	) { }

	@Throttle({ default: { limit: 5, ttl: 60000 } })
	@Get()
	// @Public()
	// @Authorize({
	// 	deniedRoles: [UserRole.USER],
	// 	allowedRoles: [Permissions.EVERYONE],
	// })
	getHello(@Request() req: RequestWithAuth, @Headers('accept-language') acceptLanguage: any): object {
		// const language = req.headers['accept-language'].split(',');
		// Reply with a greeting, the current time, the url, and request headers
		// @ts-ignore
		// console.log('DEV ~ file: app.controller.ts:42 ~ AppController ~ getHello ~ req.raw:', acceptLanguage);
		// console.log('DEV ~ file: auth.controller.ts:42 ~ AuthController ~ login ~ req:', req.clientInfo);

		return {
			greeting: this.appService.getHello(),
			date: new Date(),
			url: req.protocol + '://' + req.hostname + req.url,
			headers: Object.assign({}, req.headers),
			useragent: req.headers['user-agent'],
			clientId: req.headers['x-client-id'],
			ipAddress: req.ip,
			currentUser: req.currentUser,
			language: acceptLanguage,
		};
	}
}
