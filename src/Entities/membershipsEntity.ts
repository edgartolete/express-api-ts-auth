import { Entity, BaseEntity, ManyToOne, Unique, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './usersEntity';
import { Group } from './groupsEntity';
import { Role } from './rolesEntity';

@Entity('memberships')
@Unique(['user', 'group', 'role'])
export class Membership extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.membership)
	user: User;

	@ManyToOne(() => Group, group => group.membership)
	group: Group;

	@ManyToOne(() => Role, role => role.membership)
	role: Role;
}
