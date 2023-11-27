import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenService } from '../services/refresh-token.service';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
	constructor(private refreshTokenService: RefreshTokenService) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.refreshTokenService.extractTokenFromHeader(request);

		if (!token) throw new UnauthorizedException();

		try {
			await this.refreshTokenService.verifyToken(token);
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}
}
