import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
class RefreshToken {
	constructor(init?: Partial<RefreshToken>) {
		Object.assign(this, init);
	}
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (owner: User) => owner.tasks, {
		nullable: false,
	})
	userId: User;

	@Column()
	userAgent: string;

	@Column()
	ipAddress: string;
}

export default RefreshToken;
