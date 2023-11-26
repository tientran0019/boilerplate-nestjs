import { SetMetadata } from '@nestjs/common';
import { AuthorizationMetadata } from '../auth.interface';

export const AUTHORIZE_KEY = 'authorize';
export const Authorize = (metadata: AuthorizationMetadata = {}) => {
	return SetMetadata(AUTHORIZE_KEY, metadata ?? {});
};
