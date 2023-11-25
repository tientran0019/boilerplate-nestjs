/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:23:00

* Last updated on: 2023-11-23 23:23:00
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserRole, UserStatus, UserVerificationProviders } from 'src/users/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: { currentTime: () => Date.now() },
	autoIndex: true,
	versionKey: false,
	collection: 'User',
})
export class User extends Document {
	@Prop()
	createdAt: number;

	@Prop()
	updatedAt: number;

	@Prop({
		required: true,
		index: true,
		text: true,
		trim: true,
	})
	fullName: string;

	@Prop({
		required: true,
		unique: true,
		index: true,
		text: true,
		lowercase: true,
		trim: true,
		// defaultOptions:
	})
	email: string;

	@Prop({
		index: true,
		text: true,
		lowercase: true,
		trim: true,
	})
	phone: string;

	@Prop({
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;

	@Prop({
		enum: UserStatus,
		default: UserStatus.ACTIVE,
	})
	status: UserStatus;

	@Prop()
	country: string;

	@Prop({
		type: [String],
		// enum: Object.values(UserVerificationProviders),
		enum: UserVerificationProviders,
		// default: [],
	})
	verifiedBy: UserVerificationProviders[];

	@Prop()
	lastLoginAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
