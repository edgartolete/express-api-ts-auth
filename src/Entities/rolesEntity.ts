import { Entity, Column, OneToMany, ManyToOne, Unique } from 'typeorm';
import { Membership } from './membershipsEntity';
import { StatusBase } from './base/statusBase';
import { App } from './appsEntity';

@Entity('roles')
@Unique(['app', 'name'])
export class Role extends StatusBase {
	@Column()
	name: string;

	@OneToMany(() => Membership, membership => membership.role)
	membership: Membership[];

	@ManyToOne(() => App, app => app.roles)
	app: App;
}
