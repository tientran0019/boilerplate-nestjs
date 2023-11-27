
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '@modules/users/schemas/user.schema';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
	timestamps: { currentTime: () => Date.now() },
	autoIndex: true,
	versionKey: false,
	collection: 'RefreshToken',
})
export class RefreshToken extends Document {
	@Prop()
	createdAt: number;

	@Prop()
	updatedAt: number;

	@Prop({
		ref: User.name,
		required: true,
		type: MongooseSchema.Types.ObjectId ,
	})
	userId: Types.ObjectId;

	@Prop({
		required: true,
		unique: true,
	})
	refreshToken: string;

	@Prop({
		required: true,
	})
	currentToken: string;

	@Prop({
		default: false,
	})
	revoked: boolean;

	@Prop()
	revokedAt: number;

	@Prop()
	clientId: number;

	@Prop()
	ip: string;

	@Prop()
	userAgent: string;

	@Prop()
	address: string;

	@Prop()
	location: number[];
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
