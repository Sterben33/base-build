import { LoggerModule } from './../logger/logger.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from './../users/users.module';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([User, Task]), LoggerModule],
	controllers: [TasksController],
	providers: [TasksService],
})
export class TasksModule {}
