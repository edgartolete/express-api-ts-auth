import { Entity, Column, OneToMany, AfterLoad, ManyToOne, Unique, Index } from 'typeorm';
import { StatusBase } from './base/statusBase';
import { Membership } from './membershipsEntity';
import { App } from './appsEntity';
import { Role } from './rolesEntity';

enum Gender {
	Male = 'male',
	Female = 'female'
}
@Entity('users')
@Unique(['app', 'username'])
@Unique(['app', 'email'])
export class User extends StatusBase {
	@Column({ nullable: false })
	username: string;

	@Column({ nullable: false })
	email: string;

	@Column({ nullable: false })
	password: string;

	@Column({ nullable: true })
	firstName: string;

	@Column({ nullable: true })
	lastName: string;

	@Column({ nullable: true })
	middleName: string;

	fullName: string;
	@AfterLoad()
	setName() {
		this.fullName = `${this.firstName} ${this.middleName + ' '}${this.lastName}`;
	}

	@Column({ nullable: true })
	recovery1Q: string;

	@Column({ nullable: true })
	recovery1A: string;

	@Column({ nullable: true })
	recovery2Q: string;

	@Column({ nullable: true })
	recovery2A: string;

	@Column({ nullable: true })
	recovery3Q: string;

	@Column({ nullable: true })
	recovery3A: string;

	@Column({ nullable: true })
	photo: string;

	@Column({ type: 'date', nullable: true })
	birthday: string;

	@Column({ type: 'enum', enum: Gender, nullable: true })
	gender: Gender;

	@ManyToOne(() => Role, role => role.user)
	role: Role;

	@OneToMany(() => Membership, membership => membership.user)
	membership: Membership[];

	@ManyToOne(() => App, app => app.users)
	app: App;
}

// TODO: Low priority. create another table to record activities of users like updating
