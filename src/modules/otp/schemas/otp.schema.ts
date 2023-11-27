import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OtpActions } from '@modules/otp/otp.enum';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({
	timestamps: { currentTime: () => Date.now(), updatedAt: false },
	autoIndex: true,
	versionKey: false,
	collection: 'Otp',
})
export class Otp {
	@Prop()
	createdAt: number;

	@Prop({
		required: true,
		index: true,
		text: true,
		trim: true,
	})
	ttl: number;

	@Prop({
		required: true,
		index: true,
		text: true,
		trim: true,
	})
	code: string;

	@Prop()
	action: OtpActions;

	@Prop({
		default: false,
	})
	used: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
