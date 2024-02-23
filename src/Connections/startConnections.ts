import { initializeRedis } from './redis';
import { initializeTypeORM } from './typeorm';

export function startConnections() {
	console.log(process.env.ENV_LOC);
	initializeRedis();
	initializeTypeORM();
}
