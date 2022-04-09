import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ description: 'User unique email', example: 'a@mail.ru' })
	@IsDefined()
	@IsString()
	email: string;

	@ApiProperty({ description: 'User password', example: '123456' })
	@IsDefined()
	@IsString()
	password: string;

	@ApiProperty({ description: 'User firstName', example: 'Bob' })
	@IsDefined()
	@IsString()
	firstName: string;

	@ApiProperty({ description: 'User lastName', example: 'Martin' })
	@IsDefined()
	@IsString()
	lastName: string;
}
