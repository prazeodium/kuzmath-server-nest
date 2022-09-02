import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaTypes } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
	@Prop({ ref: 'User', required: true })
	user: SchemaTypes.Types.ObjectId;

	@Prop({ required: true })
	refreshToken: string;

	@Prop({ expires: '30d', default: Date.now })
	createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
