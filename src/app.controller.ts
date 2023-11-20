/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-14 23:54:18

* Last updated on: 2023-11-14 23:54:18
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';

import { FastifyRequest } from 'fastify';
import { Roles } from './auth/decorators/roles.decorator';
import { UserRole } from './constants/user.enum';
import { Public } from './auth/decorators/public.decorator';
import { Authorize } from './auth/decorators/authorize.decorator';
import { Permissions, RequestWithAuth } from './auth/types';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	// @Public()
	@Authorize({
		deniedRoles: [Permissions.AUTHENTICATED],
		// deniedRoles: [UserRole.USER],
	})
	getHello(@Request() req: RequestWithAuth): object {
		// const language: string = req.acceptsLanguages(['en', 'vi']) || 'en';
		// Reply with a greeting, the current time, the url, and request headers

		return {
			greeting: this.appService.getHello(),
			date: new Date(),
			url: req.protocol + '://' + req.hostname + req.url,
			headers: Object.assign({}, req.headers),
			// useragent: req.get('user-agent'),
			// clientId: req.get('x-client-id'),
			ipAddress: req.ip,
			currentUser: req.currentUser,
			// language,
		};
	}
}
