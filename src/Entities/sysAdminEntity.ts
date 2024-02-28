import { Entity, BaseEntity, Column, PrimaryColumn } from 'typeorm';

@Entity('sysadmin')
export class SysAdmin extends BaseEntity {
	@PrimaryColumn()
	username: string;

	@Column()
	password: string;
}
