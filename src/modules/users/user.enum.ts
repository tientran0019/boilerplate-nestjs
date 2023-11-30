export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN',
	BLOGGER = 'BLOGGER'
}

export enum UserStatus {
	ACTIVE = 'ACTIVE',
	// PADDING = 'PADDING', // TODO just for the invite users feature, let's implement in the future
	INACTIVE = 'INACTIVE',
}

export enum UserGender {
	MALE = 'male',
	FEMALE = 'female',
}

export enum UserVerificationProviders {
	EMAIL = 'EMAIL',
	PHONE = 'PHONE',
	// GG_AUTH = 'GG_AUTH', // TODO for the Authenticator app providing by Google
}
