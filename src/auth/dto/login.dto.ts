import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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
}
