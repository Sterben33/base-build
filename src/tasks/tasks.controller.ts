import { CustomLoggerService } from './../logger/custom-logger.service';
import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
	constructor(
		private readonly tasksService: TasksService,
		private readonly logger: CustomLoggerService,
	) {}

	@Post()
	async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
		const newTask = await this.tasksService.create(createTaskDto);
		this.logger.log(
			`Task with id ${newTask.id} was created for user with id ${newTask.owner.id}.`,
		);
		return;
	}

	@Get()
	async findAll(): Promise<Task[]> {
		return await this.tasksService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string): Promise<Task> {
		return this.tasksService.findOneById(+id);
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() updateTaskDto: UpdateTaskDto,
	): Promise<Task> {
		const updatedTask = await this.tasksService.update(+id, updateTaskDto);
		this.logger.log(`Task with id ${updatedTask.id} was updated.`);
		return updatedTask;
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<Task> {
		const deletedTask = await this.tasksService.delete(+id);
		this.logger.log(`Task with id ${deletedTask.id} was deleted.`);
		return deletedTask;
	}
}
