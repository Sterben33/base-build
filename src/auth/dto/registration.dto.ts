import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegistrationDto {
	@ApiProperty({
		example: 'example@mail.ru',
		description: 'Email of the user.',
	})
	@IsEmail({}, { message: 'Email type is not valid.' })
	email: string;

	@IsNotEmpty({ message: 'Password should not be empty' })
	@ApiProperty({ example: '123', description: 'Password for account.' })
	@IsString({ message: 'Password should be a string type.' })
	password: string;

	@IsNotEmpty({ message: 'Password confirmation should not be empty' })
	@ApiProperty({ example: '123', description: 'Must be the same as password.' })
	@IsString({ message: 'Password confirmation should be a string type.' })
	passwordConfirm: string;

	@ApiProperty({ description: 'User firstName', example: 'Bob' })
	@IsDefined()
	@IsString()
	firstName: string;

	@ApiProperty({ description: 'User lastName', example: 'Martin' })
	@IsDefined()
	@IsString()
	lastName: string;
}
