import {
	Entity,
	Column,
	OneToMany,
	ManyToOne,
	Unique,
	BaseEntity,
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryColumn
} from 'typeorm';
import { Membership } from './membershipsEntity';
import { App } from './appsEntity';
import { User } from './usersEntity';

@Entity('roles')
@Unique(['app', 'name'])
@Unique(['app', 'code'])
export class Role extends BaseEntity {
	@Column({ nullable: false })
	code: string;

	@PrimaryColumn()
	id: number;

	@Column({ nullable: false })
	name: string;

	@OneToMany(() => Membership, membership => membership.role)
	membership: Membership[];

	@ManyToOne(() => App, app => app.roles)
	app: App;

	@OneToMany(() => User, user => user.role)
	user: User[];

	@Column({
		type: 'boolean',
		default: true
	})
	isActive: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@DeleteDateColumn()
	deactivatedAt: Date;
}
