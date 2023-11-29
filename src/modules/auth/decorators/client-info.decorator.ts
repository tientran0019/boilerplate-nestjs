import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClientInfoData } from '../auth.interface';

export const ClientInfo = createParamDecorator(
	(data: string, ctx: ExecutionContext): ClientInfoData => {
		const request = ctx.switchToHttp().getRequest();

		const info = request.clientInfo || {};

		return data ? info?.[data] : info;
	},
);
