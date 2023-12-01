/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:23:00

* Last updated on: 2023-11-23 23:23:00
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserGender, UserRole, UserStatus, UserVerificationProviders } from '@modules/users/user.enum';
import { Address, AddressSchema } from './address.schema';
import { BaseSchema } from '@modules/base/schemas/base.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
	timestamps: { currentTime: () => Date.now() },
	versionKey: false,
	collection: 'User',
	toJSON: {
		getters: true,
		virtuals: true,
		// flattenObjectIds: true,
	},
})
export class User extends BaseSchema {
	@Prop({
		required: true,
		unique: true,
		index: true,
		lowercase: true,
		trim: true,
		match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
		// immutable: true,
		type: String,
	})
	email: string;

	@Prop({
		required: true,
		index: true,
		trim: true,
	})
	fullName: string;

	@Prop({
		index: true,
		lowercase: true,
		trim: true,
		// match: /^([+]\d{2})?\d{10}$/,
		// get: (phone: string) => {
		// 	if (!phone) {
		// 		return;
		// 	}
		// 	const lastThreeDigits = phone.slice(phone.length - 4);
		// 	return `****-***-${lastThreeDigits}`;
		// },
		// set: (phone: string) => {
		// 	return phone.trim();
		// },
	})
	phone: string;

	@Prop({
		enum: UserGender,
	})
	gender: UserGender;

	@Prop({
		match: /^\d{13}$/,
	})
	dateOfBirth: number;

	@Prop({
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;

	@Prop({
		enum: UserStatus,
		default: UserStatus.ACTIVE,
		// select: false, // hidden this prop in the result of query
		// immutable: true, // Don't allow change
	})
	status: UserStatus;

	@Prop({
		type: [
			{
				type: AddressSchema,
			},
		],
	})
	address: Address[];

	@Prop({
		type: [String],
		// enum: Object.values(UserVerificationProviders),
		enum: UserVerificationProviders,
		// default: [],
	})
	verifiedBy: UserVerificationProviders[];

	@Prop({
		match: /^\d{13}$/,
	})
	lastLoginAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.index({ email: 'text', fullName: 'text' }, { unique: true });

// UserSchema.plugin(require('mongoose-autopopulate'));

// UserSchema.pre('save', async function (next) {
// 	console.log('DEV ~ file: user.schema.ts:93 ~ next:', next);
// 	// OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
// 	// const user = await this.model.findOne(this.getFilter());
// 	return next();
// });

// UserSchema.virtual('defaultAddress').get(function (this: UserDocument) {
// 	if (this.address?.[0]) {
// 		return `${(this.address[0].street && ' ') || ''}${this.address[0].city} ${this.address[0].state} ${this.address[0].country}`;
// 	}
// });

// UserSchema.virtual('username').get(function (this: UserDocument) {
// 	return this.email?.split('@')[0];
// });

// export const UserSchemaFactory = (
// 	flash_card_model: Model<FlashCardDocument>,
// 	collection_model: Model<CollectionDocument>,
// ) => {
// 	const user_schema = UserSchema;

// 	user_schema.pre('findOneAndDelete', async function (next: NextFunction) {
// 		// OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
// 		const user = await this.model.findOne(this.getFilter());
// 		await Promise.all([
// 			flash_card_model
// 				.deleteMany({
// 					user: user._id,
// 				})
// 				.exec(),
// 			collection_model
// 				.deleteMany({
// 					user: user._id,
// 				})
// 				.exec(),
// 		]);
// 		return next();
// 	});
// 	return user_schema;
// };

// import to module
// imports: [
// 	MongooseModule.forFeatureAsync([
// 		{
// 			name: User.name,
// 			useFactory: UserSchemaFactory,
// 			inject: [getModelToken(FlashCard.name), getModelToken(Collection.name)],
// 			imports: [
// 				MongooseModule.forFeature([
// 					{ name: FlashCard.name, schema: FlashCardSchema },
// 					{ name: Collection.name, schema: CollectionSchema },
// 				]),
// 			],
// 		},
// 	]),
// ]
