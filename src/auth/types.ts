
/**
 * Built-in roles
 */
export const OWNER = '$owner';
export const EVERYONE = '$everyone';
export const AUTHENTICATED = '$authenticated';
export const UNAUTHENTICATED = '$unauthenticated';

/**
 * Describes the token object that returned by the refresh token service functions.
 */
export type TokenObject = {
	accessToken: string;
	expiresIn?: string | undefined;
	refreshToken?: string | undefined;
};

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
