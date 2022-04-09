import { Task } from './../../tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
	email: string;

	@Column({ select: false })
	passwordHash: string;

	@OneToMany(() => Task, (task: Task) => task.owner, { eager: false })
	tasks: Task;
}
