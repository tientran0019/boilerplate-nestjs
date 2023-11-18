import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
		console.log('DEV ~ file: role.guard.ts:10 ~ RolesGuard ~ canActivate ~ roles:', roles);

		if (!roles) {
			return true;
		}
		const { currentUser } = context.switchToHttp().getRequest();
		console.log('DEV ~ file: role.guard.ts:17 ~ RolesGuard ~ canActivate ~ currentUser:', currentUser);

		if (!currentUser) {
			throw new UnauthorizedException();
		}

		if (!currentUser.role) {
			throw new ForbiddenException('Forbidden');
		}

		const hasRole = roles.includes(currentUser.role);

		if (!hasRole) {
			throw new ForbiddenException('Forbidden');
		}

		return currentUser && currentUser.role && hasRole;
	}
}
