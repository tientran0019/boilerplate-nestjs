import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTHORIZE_KEY } from '../decorators/authorize.decorator';
import { AuthorizationMetadata, ClientInfoData, Permissions, UserProfileForToken } from '../auth.interface';
import { AccessTokenService } from '../services/access-token.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthorizeGuard implements CanActivate {
	constructor(
		private accessTokenService: AccessTokenService,
		private reflector: Reflector,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { allowedRoles, deniedRoles } = this.reflector.getAllAndOverride<AuthorizationMetadata>(AUTHORIZE_KEY, [
			context.getHandler(),
			context.getClass(),
		]) || {};

		const request = context.switchToHttp().getRequest();
		// console.log('DEV ~ file: authorize.guard.ts:22 ~ AuthorizeGuard ~ canActivate ~ request:', request);
		const token = this.accessTokenService.extractTokenFromHeader(request);

		const data = request.body;
		console.log('DEV ~ file: authorize.guard.ts:106 ~ AuthorizeGuard ~ canActivate ~ request.query:', request.query);
		console.log('DEV ~ file: authorize.guard.ts:106 ~ AuthorizeGuard ~ canActivate ~ request.params:', request.params);
		console.log('DEV ~ file: authorize.guard.ts:106 ~ AuthorizeGuard ~ canActivate ~ data:', data);

		// No access if authorization details are missing
		let currentUser: UserProfileForToken;

		if (token) {
			try {
				currentUser = await this.accessTokenService.verifyToken(token);
			} catch (error) {
				// ignore
			}

			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request['currentUser'] = currentUser;
		}

		const clientInfo: ClientInfoData = {
			useragent: request.headers['user-agent'],
			clientId: request.headers['x-client-id'],
			address: request.headers['cf-ipcountry'],
			location: [request.headers['x-lat'], request.headers['x-long']],
			ip: request.ip,
		};

		request['clientInfo'] = clientInfo;


		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			// 💡 See this condition
			return true;
		}

		if ((!allowedRoles || allowedRoles.length === 0) && (!deniedRoles || deniedRoles.length === 0)) {
			return true;
		}

		let canAccess = false;

		if (allowedRoles?.length > 0) {
			if (allowedRoles?.includes(Permissions.EVERYONE)) {
				canAccess = true;
			} else if (allowedRoles?.includes(Permissions.AUTHENTICATED)) {
				canAccess = !!currentUser;
			} else if (allowedRoles?.includes(Permissions.UNAUTHENTICATED)) {
				canAccess = !currentUser;
			} else {
				if (currentUser?.role && allowedRoles?.includes(currentUser.role)) {
					return true;
				} else {
					return false;
				}
			}
		}

		if (deniedRoles?.length > 0) {
			if (deniedRoles?.includes(Permissions.EVERYONE)) {
				canAccess = false;
			} else if (deniedRoles?.includes(Permissions.AUTHENTICATED)) {
				canAccess = !currentUser;
			} else if (deniedRoles?.includes(Permissions.UNAUTHENTICATED)) {
				canAccess = !!currentUser;
			} else {
				if (currentUser?.role && deniedRoles?.includes(currentUser.role)) {
					return false;
				} else {
					return true;
				}
			}
		}

		/**
		 * Allow access only to model owners, using route as source of truth
		 *
		 * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
		 */

		if (deniedRoles?.includes(Permissions.OWNER) && currentUser?.id === 'TODO') {
			canAccess = false;
		}
		if (allowedRoles?.includes(Permissions.OWNER) && currentUser?.id === 'TODO') {
			canAccess = true;
		}

		return canAccess;
	}
}
