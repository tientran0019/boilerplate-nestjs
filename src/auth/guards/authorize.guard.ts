import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AUTHORIZE_KEY } from '../decorators/authorize.decorator';
import { AUTHENTICATED, AuthorizationMetadata, EVERYONE, OWNER, UNAUTHENTICATED, UserProfileForToken } from '../types';
import { AccessTokenService } from '../access-token.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthorizeGuard implements CanActivate {
	constructor(
		private accessTokenService: AccessTokenService,
		private reflector: Reflector,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { allowedRoles, deniedRoles } = this.reflector.get<AuthorizationMetadata>(AUTHORIZE_KEY, context.getHandler()) || {};
		console.log('DEV ~ file: authorize.guard.ts:17 ~ AuthorizeGuard ~ canActivate ~ allowedRoles, deniedRoles:', allowedRoles, deniedRoles);

		const request = context.switchToHttp().getRequest();
		const token = this.accessTokenService.extractTokenFromHeader(request);

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
		console.log('DEV ~ file: authorize.guard.ts:35 ~ AuthorizeGuard ~ canActivate ~ currentUser:', currentUser);

		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			// 💡 See this condition
			return true;
		}

		if (!allowedRoles && !deniedRoles) {
			return true;
		}

		if (deniedRoles?.includes(EVERYONE)) {
			return false;
		}

		if (allowedRoles?.includes(EVERYONE)) {
			return true;
		}

		if (deniedRoles?.includes(AUTHENTICATED)) {
			if (currentUser) {
				return false;
			}
			return true;
		}

		if (deniedRoles?.includes(UNAUTHENTICATED)) {
			if (!currentUser) {
				return false;
			}
			return true;
		}

		if (allowedRoles?.includes(AUTHENTICATED)) {
			if (!currentUser) {
				return false;
			}
			return true;
		}

		if (allowedRoles?.includes(UNAUTHENTICATED)) {
			if (currentUser) {
				return false;
			}
			return true;
		}

		console.log('DEV ~ file: authorize.guard.ts:65 ~ AuthorizeGuard ~ canActivate ~ currentUser:', currentUser);

		if (!currentUser?.role) {
			return false;
		}

		/**
		 * Allow access only to model owners, using route as source of truth
		 *
		 * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
		 */
		if (deniedRoles?.includes(OWNER) && currentUser.id === 'TODO') {
			return false;
		}
		if (allowedRoles?.includes(OWNER) && currentUser.id === 'TODO') {
			return true;
		}

		if (!allowedRoles || allowedRoles.length === 0) {
			if (!deniedRoles || deniedRoles.length === 0) {
				return true;
			}
			return deniedRoles?.includes(currentUser.role) ? false : true;
		}

		return allowedRoles?.includes(currentUser.role) ? true : false;
	}
}
