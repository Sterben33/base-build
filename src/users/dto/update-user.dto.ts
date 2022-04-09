import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class UpdateUserDto {
	@ApiProperty({ description: 'User new firstName', example: 'Bob' })
	@IsDefined()
	@IsString()
	firstName: string;

	@ApiProperty({ description: 'User new lastName', example: 'Martin' })
	@IsDefined()
	@IsString()
	lastName: string;
}
