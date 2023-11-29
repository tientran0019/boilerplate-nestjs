/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:21:14

* Last updated on: 2023-11-23 23:21:14
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '@modules/users/users.service';
import { UsersController } from '@modules/users/users.controller';
import { User, UserSchema } from '@modules/users/schemas/user.schema';
import { AuthModule } from '@modules/auth/auth.module';
import { MailModule } from '@modules/mail/mail.module';

@Module({
	imports: [
		AuthModule,
		MailModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
		]),
	],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule { }
