import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
	@Prop()
	name: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ default: false })
	isActivated: boolean;

	@Prop()
	activationLink: string;

	/*
	@Prop()
	first_name: string;

	@Prop()
	last_name: string;

	@Prop()
	phone: string;

	@Prop()
	photoUrl: string;

	@Prop()
	coverPhotoUrl: string;

	@Prop()
	address: string;

	@Prop()
	description: string;

	@Prop({ default: 0 })
	score: number;

	@Prop({ default: 'STUDENT' })
	role: string;

	@Prop({ default: [] })
	wishlist: SchemaTypes.Types.ObjectId[];

	@Prop({ default: [] })
	cartList: SchemaTypes.Types.ObjectId[];

	@Prop()
	fId: string;

	@Prop()
	log_in_time: string;
	*/
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.index({ score: 1 });

UserSchema.methods.toJSON = function () {
	const userObject = this.toObject();
	userObject.id = userObject._id;

	delete userObject._id;
	delete userObject.__v;
	delete userObject['createdAt'];
	delete userObject['updatedAt'];

	return userObject;
};
