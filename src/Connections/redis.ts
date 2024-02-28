import { createClient } from 'redis';
import { Signs } from '../Utils/constants';

export const redisClient = createClient();

export function initializeRedis() {
	try {
		redisClient.connect();
		redisClient.on('connect', () => console.log(`${Signs.okay} Redis connected`));
		redisClient.on('ready', () => console.log(`${Signs.okay} Redis ready`));
		redisClient.on('reconnecting', () => console.log(`${Signs.warning} Redis reconnecting`));
	} catch (error) {
		console.log(`try catch error:`, error);
		redisClient.on('error', err => console.log(`${Signs.error} Redis error: `, err));
	}
}

export async function getRedisRecord(email: string): Promise<string | null> {
	const value = await redisClient.get(email);
	return value;
}

export async function delRedisRecord(email: string) {
	await redisClient.del(email);
}

export async function stopRedis() {
	await redisClient.quit();
	redisClient.on('end', () => console.log(`${Signs.okay} Redis ended`));
}
