import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) {
			return true;
		}
		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user) {
			throw new UnauthorizedException();
		}

		if (!user.roles) {
			throw new ForbiddenException('Forbidden');
		}

		const hasRole = roles.includes(user.role);

		if (!hasRole) {
			throw new ForbiddenException('Forbidden');
		}

		return user && user.roles && hasRole;
	}
}
