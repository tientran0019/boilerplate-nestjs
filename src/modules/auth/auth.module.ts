import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/services/auth.service';
import { RefreshToken, RefreshTokenSchema } from '@modules/auth/schemas/refresh-token.schema';
import { RefreshTokenService } from '@modules/auth/services/refresh-token.service';
import { AccessTokenService } from '@modules/auth/services/access-token.service';
import { AuthorizeGuard } from '@modules/auth/guards/authorize.guard';
import { UserCredentials, UserCredentialsSchema } from '@modules/auth/schemas/user-credentials.schema';
import { User, UserSchema } from '@modules/users/schemas/user.schema';
import { MailModule } from '@modules/mail/mail.module';
import { OtpModule } from '@modules/otp/otp.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: UserCredentials.name, schema: UserCredentialsSchema },
			{ name: User.name, schema: UserSchema },
			{ name: RefreshToken.name, schema: RefreshTokenSchema },
		]),
		JwtModule.register({}),
		MailModule,
		OtpModule,
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
