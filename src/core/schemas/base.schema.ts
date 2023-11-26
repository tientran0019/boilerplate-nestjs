import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseSchema extends Document {
	_id?: string; // In the future, using class-transformer to serialize data response

	@Prop({
		default: false,
		select: false,
	})
	isDeleted: boolean; // using for soft delete

	@Prop({
		select: false,
	})
	deletedAt: number; // using for soft delete
}
