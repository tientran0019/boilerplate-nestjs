import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/core/schemas/base.schema';

export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address extends BaseSchema {
	@Prop({ minlength: 2, maxlength: 120 })
	street?: string;

	@Prop({ required: true, minlength: 2, maxlength: 50 })
	state: string;

	@Prop({ required: true, minlength: 2, maxlength: 50 })
	city: string;

	@Prop({ required: false, minlength: 2, maxlength: 50 })
	postalCode?: number;

	@Prop({ required: true, minlength: 2, maxlength: 50 })
	country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
