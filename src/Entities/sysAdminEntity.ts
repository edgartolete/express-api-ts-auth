import { Entity, BaseEntity, Column, PrimaryColumn, Unique } from 'typeorm';

@Entity('sysadmin')
@Unique(['username'])
export class SysAdmin extends BaseEntity {
	@PrimaryColumn({ nullable: false, unique: true })
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;
}
