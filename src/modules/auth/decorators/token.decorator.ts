import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Token = createParamDecorator(
	(data: 'Bearer' | 'Refresh', ctx: ExecutionContext): string | undefined => {
		const request: FastifyRequest = ctx.switchToHttp().getRequest();

		const [type, token] = request.headers.authorization?.split(' ') ?? [];

		if (data === 'Refresh') {
			return type === 'Refresh' ? token : undefined;
		}

		return type === 'Bearer' ? token : undefined;
	},
);
