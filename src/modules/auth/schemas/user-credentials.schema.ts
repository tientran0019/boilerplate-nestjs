import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type UserCredentialsDocument = HydratedDocument<UserCredentials>;

@Schema({
	autoIndex: true,
	versionKey: false,
	collection: 'UserCredentials',
})
export class UserCredentials extends Document {
	@Prop({
		ref: User.name,
		required: true,
		type: MongooseSchema.Types.ObjectId,
	})
	userId: Types.ObjectId;

	@Prop({
		required: true,
	})
	password: string;
}

export const UserCredentialsSchema = SchemaFactory.createForClass(UserCredentials);
