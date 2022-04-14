import { LoggerModule } from './../logger/logger.module';
import { AppModule } from './../app.module';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		forwardRef(() => AppModule),
		LoggerModule,
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
