import { Entity, BaseEntity, Column, PrimaryColumn, Index, OneToMany } from 'typeorm';
import { Group } from './groupsEntity';
import { User } from './usersEntity';
import { Role } from './rolesEntity';

@Entity('apps')
export class App extends BaseEntity {
	@PrimaryColumn({ type: 'bigint' })
	id: number;

	@Column({ nullable: false, unique: true })
	@Index()
	code: string;

	@Column({ nullable: false })
	name: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@Column()
	apiKey: string;

	@Column({ type: 'text' })
	accessTokenSecret: string;

	@Column({ type: 'text' })
	refreshTokenSecret: string;

	@Column({ type: 'boolean', default: false })
	twoFactorAuthEnabled: boolean;

	@OneToMany(() => User, user => user.app)
	users: User[];

	@OneToMany(() => Group, group => group.app)
	groups: Group[];

	@OneToMany(() => Role, role => role.app)
	roles: Role[];
}
