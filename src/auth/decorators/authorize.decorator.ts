import { SetMetadata } from '@nestjs/common';
import { AuthorizationMetadata } from '../types';

export const AUTHORIZE_KEY = 'authorize';
export const Authorize = (metadata: AuthorizationMetadata = {}) => {
	return SetMetadata(AUTHORIZE_KEY, metadata ?? {});
};
