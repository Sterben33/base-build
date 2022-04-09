import { User } from 'src/users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import {
	couldNotCreateTaskOfNonExistingUserError as couldNotSaveTaskOfNonExistingUserError,
	taskDoesNotExistsError,
} from './tasks.errors';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task) private readonly taskRepository: Repository<Task>,
		private readonly userService: UsersService,
		private readonly logger: CustomLoggerService,
	) {}

	async create(createTaskDto: CreateTaskDto): Promise<Task> {
		const created = this.taskRepository.create({
			text: createTaskDto.text,
			owner: await this.ifNoUserExistsThrowException(createTaskDto.owner),
		});
		const saved = this.taskRepository.save(created);

		return saved;
	}

	async findAll(): Promise<Task[]> {
		return this.taskRepository.find({ loadRelationIds: true });
	}

	async findOneById(id: number): Promise<Task> {
		const task = await this.taskRepository.findOne(id, {
			relations: ['owner'],
		});
		if (!task) {
			const errorText = taskDoesNotExistsError(id);
			this.logger.warn(errorText, this.constructor.name);
			throw new NotFoundException(errorText);
		}
		return task;
	}

	async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
		const { affected } = await this.taskRepository.update(
			id,
			this.taskRepository.create({
				text: updateTaskDto.text,
				owner: await this.ifNoUserExistsThrowException(updateTaskDto.owner),
			}),
		);
		this.ifNoRowsAffectedThrowException(affected, id);
		return this.findOneById(id);
	}

	async delete(id: number): Promise<Task> {
		const task = await this.findOneById(id);
		await this.taskRepository.delete(id);
		return task;
	}

	private async ifNoUserExistsThrowException(userId: number): Promise<User> {
		const user = await this.userService.findOneById(userId);
		if (!user) {
			const errorText = couldNotSaveTaskOfNonExistingUserError(userId);
			this.logger.warn(errorText, this.constructor.name);
			throw new NotFoundException(errorText);
		}
		return user;
	}

	private ifNoRowsAffectedThrowException(
		affected: number,
		taskId: number,
	): void {
		if (!affected) {
			const errorText = taskDoesNotExistsError(taskId);
			this.logger.warn(errorText, this.constructor.name);
			throw new NotFoundException(errorText);
		}
	}
}
