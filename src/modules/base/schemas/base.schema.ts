import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseSchema extends Document {
	@Prop({
		default: false,
	})
	_isDeleted: boolean; // using for soft delete

	@Prop()
	_deletedAt: number; // using for soft delete

	@Prop({
		immutable: true,
		match: /^\d{13}$/,
	})
	createdAt: number;

	@Prop({
		match: /^\d{13}$/,
	})
	updatedAt: number;
}
