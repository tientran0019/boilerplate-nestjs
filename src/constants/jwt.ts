export const jwtConstants = {
	tokenSecret: process.env.TOKEN_SECRET,
	tokenExpiresIn: process.env.TOKEN_EXPIRES_IN,
	refreshSecret: process.env.REFRESH_SECRET,
	refreshExpiresIn: process.env.REFRESH_EXPIRES_IN,
	refreshIssuer: process.env.REFRESH_ISSUER,
};
