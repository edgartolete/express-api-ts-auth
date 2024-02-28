import { Entity, Column, OneToMany, ManyToOne, Unique } from 'typeorm';
import { StatusBase } from './base/statusBase';
import { Membership } from './membershipsEntity';
import { App } from './appsEntity';

@Entity('groups')
@Unique(['app', 'name'])
export class Group extends StatusBase {
	@Column()
	name: string;

	@ManyToOne(() => App, app => app.groups)
	app: App;

	@OneToMany(() => Membership, membership => membership.group)
	membership: Membership[];
}
