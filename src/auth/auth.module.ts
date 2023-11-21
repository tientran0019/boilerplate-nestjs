import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/services/auth.service';
import { RefreshToken, RefreshTokenSchema } from 'src/auth/schemas/refresh-token.schema';
import { RefreshTokenService } from 'src/auth/services/refresh-token.service';
import { AccessTokenService } from 'src/auth/services/access-token.service';
import { AuthorizeGuard } from 'src/auth/guards/authorize.guard';
import { UserCredentials, UserCredentialsSchema } from 'src/auth/schemas/user-credentials.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: UserCredentials.name, schema: UserCredentialsSchema },
			{ name: User.name, schema: UserSchema },
			{ name: RefreshToken.name, schema: RefreshTokenSchema },
		]),
		JwtModule.register({}),
		MailModule,
	],
	providers: [
		AuthService,
		RefreshTokenService,
		AccessTokenService,
		{
			provide: APP_GUARD,
			useClass: AuthorizeGuard,
		},
	],
	controllers: [AuthController],
	exports: [
		AuthService,
		RefreshTokenService,
		AccessTokenService,
	],
})
export class AuthModule { }
