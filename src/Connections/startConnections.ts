import { initializeMongoDB } from './mongoDB';
import { initializeRedis } from './redis';
import { initializeTypeORM } from './typeorm';

export function startConnections() {
	initializeRedis();
	initializeTypeORM();
	initializeMongoDB();
}
