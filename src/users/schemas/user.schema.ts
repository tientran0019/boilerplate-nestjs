import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument } from 'mongoose';
import { UserRole, UserStatus } from 'src/constants/user.enum';

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

	@ApiProperty({
		example: 'Maine Coon',
		description: 'The breed of the Cat',
	})
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
	lastLoginAt: number;

	@Prop()
	country: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
