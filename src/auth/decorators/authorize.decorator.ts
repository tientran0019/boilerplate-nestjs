import { SetMetadata } from '@nestjs/common';
import { AuthorizationMetadata } from '../types';

export const AUTHORIZE_KEY = 'authorize';
export const Authorize = (metadata: AuthorizationMetadata = {}) => {
	console.log('DEV ~ file: authorize.decorator.ts:6 ~ Authorize ~ metadata:', metadata);
	return SetMetadata(AUTHORIZE_KEY, metadata ?? {});
};
