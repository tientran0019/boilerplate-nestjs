import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserRole } from 'src/constants/user';

export type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: { currentTime: () => Date.now() },
	autoIndex: true,
	versionKey: false,
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
	firstName: string;

	@Prop({
		required: true,
		index: true,
		text: true,
		trim: true,
	})
	lastName: string;

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
		required: true,
	})
	password: string;

	@Prop({
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
