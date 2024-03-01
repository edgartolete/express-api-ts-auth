import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity()
export class StatusBase extends BaseEntity {
	@PrimaryColumn({
		type: 'bigint',
		unique: true,
		unsigned: true,
		nullable: false
	})
	id: number;

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
