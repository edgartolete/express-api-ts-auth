import { initializeMongoDB } from './mongoDB';
import { initializeRedis } from './redis';
import { initializeTypeORM } from './typeorm';
import { initializeWebSocket } from './webSocket';

export function startConnections() {
	initializeRedis();
	initializeTypeORM();
	initializeMongoDB();
	initializeWebSocket();
}
