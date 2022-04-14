import { Task } from './../../tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
	@ApiProperty({ description: 'User unique id', example: 1 })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: 'User first name', example: 'Bobby' })
	@Column()
	firstName: string;

	@ApiProperty({ description: 'User last name', example: 'Marlow' })
	@Column()
	lastName: string;

	@ApiProperty({ description: 'User unique email', example: 'a@mail.ru' })
	@Column({ unique: true })
	email: string;

	@Column({ select: false })
	passwordHash: string;

	@OneToMany(() => Task, (task: Task) => task.owner, { eager: false })
	tasks: Task;
}
