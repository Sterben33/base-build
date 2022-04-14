import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Create new user' })
	@ApiResponse({ status: 200, type: User })
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@ApiOperation({ summary: 'Get list of all the users' })
	@ApiResponse({ status: 200, type: User, isArray: true })
	@Get()
	findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@ApiOperation({ summary: 'Get user by id' })
	@ApiResponse({ status: 200, type: User })
	@ApiResponse({ status: 404, description: 'Not found' })
	@Get('/:id')
	async findOne(@Param('id') id: string) {
		return await this.usersService.findOneById(+id);
	}

	@ApiOperation({ summary: 'Update user by id' })
	@ApiResponse({ status: 200, type: User })
	@ApiResponse({ status: 404, description: 'Not found' })
	@Put(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@ApiOperation({ summary: 'Delete user by id' })
	@ApiResponse({ status: 200, type: User })
	@ApiResponse({ status: 404, description: 'Not found' })
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.delete(+id);
	}
}
