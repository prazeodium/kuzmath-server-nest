import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [
		MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
		forwardRef(() => AuthModule),
	],
	exports: [UsersService],
})
export class UsersModule {}
