import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfileForToken } from '../auth.interface';

export const CurrentUser = createParamDecorator(
	(data: string, ctx: ExecutionContext): UserProfileForToken => {
		const request = ctx.switchToHttp().getRequest();

		const user = request.currentUser || {};

		return data ? user?.[data] : user;
	},
);
