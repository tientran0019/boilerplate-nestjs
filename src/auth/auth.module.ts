import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { RefreshTokenService } from './refreshtoken.service';
import { AccessTokenService } from './accesstoken.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: RefreshToken.name, schema: RefreshTokenSchema },
		]),
		JwtModule.register({}),
		UsersModule,
	],
	providers: [
		AuthService,
		RefreshTokenService,
		AccessTokenService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
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
