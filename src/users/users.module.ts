import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from 'src/users//users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserCredentials, UserCredentialsSchema } from './schemas/user-credentials.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: UserCredentials.name, schema: UserCredentialsSchema },
		]),
	],
	providers: [UsersService, JwtService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule { }
