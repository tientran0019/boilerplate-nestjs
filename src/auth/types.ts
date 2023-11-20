import { FastifyRequest } from 'fastify';
import { User } from 'src/users/schemas/user.schema';

/**
 * Built-in roles
 */
export enum Permissions {
	OWNER = '$owner',
	EVERYONE = '$everyone',
	AUTHENTICATED = '$authenticated',
	UNAUTHENTICATED = '$unauthenticated',
}

/**
 * Describes the token object that returned by the refresh token service functions.
 */
export type TokenObject = {
	accessToken: string;
	expiresIn?: string | undefined;
	refreshToken?: string | undefined;
};

export interface ResLoginObject {
	user: User,
	backendTokens: {
		accessToken: string,
		refreshToken: string,
		expiresIn: string | number,
	}
}

// Describes the type of grant object taken in by method "refresh"
export type RefreshGrant = {
	refreshToken: string;
};

/**
* The minimum set of attributes that describe a user.
*/
export interface UserProfileForToken {
	id: string;
	email: string;
	name: string;
	role: string;
	// [attribute: string]: any;
}

/**
 * Authorization metadata supplied via `@authorize` decorator
 */
export interface AuthorizationMetadata {
    /**
     * Roles that are allowed access
     */
    allowedRoles?: string[];
    /**
     * Roles that are denied access
     */
    deniedRoles?: string[];
}

export interface RequestWithAuth extends FastifyRequest {
	currentUser: UserProfileForToken
}
