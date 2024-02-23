import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { Signs } from '../Utils/constants';

export const dataSource = new DataSource({
	type: 'mysql',
	host: process.env.DB_HOST,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: 3306,
	logging: false,
	poolSize: 10,
	dropSchema: false, //use to drop schema if getting an issue. do not use in production.
	synchronize: true, //only for development. use migration for production
	entities: [],
	migrations: [
		// 'dist/database/migrations/1696156148740-generate.js', // added users
	]
});

export function initializeTypeORM() {
	dataSource
		.initialize()
		.then(() => {
			console.log(`${Signs.okay} TypeORM connected to the database`);
			dataSource.runMigrations();
		})
		.catch(err => {
			console.log(`${Signs.error} TypeORM Error connecting to the database: ${err}`);
		});
}

export function stopTypeORM() {
	if (dataSource.isInitialized) {
		dataSource.destroy();
	}
}
