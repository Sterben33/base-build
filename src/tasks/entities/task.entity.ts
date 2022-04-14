import { User } from '../../users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	text: string;

	@Column({ default: false })
	done: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (owner: User) => owner.tasks, {
		nullable: false,
	})
	owner: User;
}
