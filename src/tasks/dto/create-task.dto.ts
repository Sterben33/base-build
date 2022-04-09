import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
	@ApiProperty({
		description: 'TODO text for task',
		example: 'Wash the dishes',
	})
	@IsNotEmpty()
	@IsString()
	text: string;

	@ApiProperty({
		description: 'Id of existing user',
		example: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	owner: number;
}
