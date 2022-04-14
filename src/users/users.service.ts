import { CustomLoggerService } from '../logger/custom-logger.service';
import { SecureService } from '../utils/secure.service';
import {
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
	USER_WITH_EMAIL_ALREADY_EXISTS_ERROR,
	USER_WITH_ID_NOT_FOUND_ERROR,
} from './users.constants';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly secureService: SecureService,
		private readonly logger: CustomLoggerService,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = await this.findOneByEmail(createUserDto.email);

		if (user) {
			this.logger.warn(
				USER_WITH_EMAIL_ALREADY_EXISTS_ERROR,
				this.constructor.name,
			);
			throw new UnprocessableEntityException(
				USER_WITH_EMAIL_ALREADY_EXISTS_ERROR,
			);
		}
		return this.userRepository.save({
			firstName: createUserDto.firstName,
			lastName: createUserDto.lastName,
			email: createUserDto.email,
			passwordHash: await this.secureService.hashString(createUserDto.password),
		});
	}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findOneById(id: number): Promise<User> {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			this.logger.warn(USER_WITH_ID_NOT_FOUND_ERROR, this.constructor.name);
			throw new NotFoundException(USER_WITH_ID_NOT_FOUND_ERROR);
		}
		return user;
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.userRepository.findOne({
			where: { email },
			select: ['id', 'passwordHash'],
		});
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		const { affected } = await this.userRepository.update(id, updateUserDto);
		this.ifNoRowsAffectedThrowException(affected);
		return this.findOneById(id);
	}

	async delete(id: number): Promise<User> {
		const user = await this.findOneById(id);
		await this.userRepository.delete(id);
		return user;
	}

	private ifNoRowsAffectedThrowException(affected: number): void {
		if (!affected) {
			this.logger.warn(USER_WITH_ID_NOT_FOUND_ERROR, this.constructor.name);
			throw new NotFoundException(USER_WITH_ID_NOT_FOUND_ERROR);
		}
	}
}
