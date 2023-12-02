import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseSchema extends Document {
	@Prop({
		default: false,
	})
	_isDeleted: boolean; // using for soft delete

	@Prop({
		required: false,
	})
	_deletedAt: number; // using for soft delete

	@Prop({
		ref: 'User',
		required: false,
		type: String ,
	})
	_deletedBy?: string;

	@Prop({
		immutable: true,
		match: /^\d{13}$/,
	})
	createdAt: number;

	@Prop({
		ref: 'User',
		required: false,
		type: String ,
	})
	createdBy?: string;

	@Prop({
		match: /^\d{13}$/,
	})
	updatedAt: number;

	@Prop({
		ref: 'User',
		required: false,
		type: String,
	})
	updatedBy?: string;
}
