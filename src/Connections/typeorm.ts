import { DataSource, DataSourceOptions } from 'typeorm';
import 'reflect-metadata';
import { Signs } from '../Utils/constants';
import { User } from '../Entities/usersEntity';
import { App } from '../Entities/appsEntity';
import { Group } from '../Entities/groupsEntity';
import { Role } from '../Entities/rolesEntity';
import { Membership } from '../Entities/membershipsEntity';
import { SysAdmin } from '../Entities/sysAdminEntity';
import { getRuntimeConfig } from '../config';
import dotenv from 'dotenv';
dotenv.config();

const { environment } = getRuntimeConfig();

/**
 * ### METHODS DO NOT USE IN PRODUCTION ###
 * dropSchema - Set to true to drop schema if getting an issue, then turn back to false once done. Sometimes there will be an issue with Constraints like Foreign key which this will be useful.
 * synchronize - Set to true to automatically sync database table changes.Use migrations instead.
 */

const localConnection = {
	type: 'mysql',
	host: process.env.LOCAL_DB_HOST,
	username: process.env.LOCAL_DB_USER,
	password: process.env.LOCAL_DB_PASS,
	database: process.env.LOCAL_DB_NAME,
	port: process.env.LOCAL_DB_PORT,
	logging: false,
	poolSize: 10,
	dropSchema: false,
	synchronize: true,
	entities: [App, SysAdmin, User, Group, Role, Membership],
	migrations: []
} as DataSourceOptions;

const testConnection = {
	type: 'postgres',
	host: process.env.TEST_DB_HOST,
	username: process.env.TEST_DB_USER,
	password: process.env.TEST_DB_PASS,
	database: process.env.TEST_DB_NAME,
	port: process.env.TEST_DB_PORT,
	ssl: true,
	extra: {
		ssl: {
			rejectUnauthorized: false
		}
	},
	connection: {
		options: `project=${process.env.TEST_DB_ENDPOINT}`
	},
	logging: false,
	poolSize: 10,
	dropSchema: false,
	synchronize: true,
	entities: [App, SysAdmin, User, Group, Role, Membership],
	migrations: []
} as DataSourceOptions;

const prodConnection = {
	type: 'mysql',
	host: process.env.PROD_DB_HOST,
	username: process.env.PROD_DB_USER,
	password: process.env.PROD_DB_PASS,
	database: process.env.PROD_DB_NAME,
	port: process.env.PROD_DB_PORT,
	logging: false,
	poolSize: 10,
	dropSchema: false,
	synchronize: false, // do not set to true, use migration instead
	entities: [App, SysAdmin, User, Group, Role, Membership],
	migrations: [
		// 'dist/database/migrations/1696156148740-generate.js', // added users
	]
} as DataSourceOptions;

const connection: DataSourceOptions =
	{
		local: localConnection,
		test: testConnection,
		production: prodConnection
	}[environment] ?? localConnection;

export const dataSource = new DataSource(connection);

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
