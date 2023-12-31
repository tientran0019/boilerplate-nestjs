import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AccessTokenService } from '../services/access-token.service';
import { ClientInfoData } from '../auth.interface';

@Injectable()
export class AuthenticateGuard implements CanActivate {
	constructor(
		private accessTokenService: AccessTokenService,
		private reflector: Reflector,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(), ,
		]);

		if (isPublic) {
			// 💡 See this condition
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const token = this.accessTokenService.extractTokenFromHeader(request);

		const clientInfo: ClientInfoData = {
			useragent: request.headers['user-agent'],
			clientId: request.headers['x-client-id'],
			address: request.headers['cf-ipcountry'],
			location: [request.headers['x-lat'], request.headers['x-long']],
			ip: request.ip,
		};

		request['clientInfo'] = clientInfo;

		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const payload = await this.accessTokenService.verifyToken(token);

			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request['currentUser'] = payload;
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}
}
