import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseSchema extends Document {
	@Prop({
		default: false,
	})
	_isDeleted: boolean; // using for soft delete

	@Prop()
	_deletedAt: number; // using for soft delete
}
