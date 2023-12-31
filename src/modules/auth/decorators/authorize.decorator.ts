import { SetMetadata } from '@nestjs/common';
import { AuthorizationMetadata } from '../auth.interface';

export const AUTHORIZE_KEY = 'authorize';
export const Authorize = (metadata: AuthorizationMetadata = {}): ClassDecorator & MethodDecorator => {
	return SetMetadata(AUTHORIZE_KEY, metadata ?? {});
};
