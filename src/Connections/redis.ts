import { createClient } from 'redis';
import { Signs } from '../Utils/constants';

export const client = createClient();

export function initializeRedis() {
	try {
		client.connect();
		client.on('connect', () => console.log(`${Signs.okay} Redis connected`));
		client.on('ready', () => console.log(`${Signs.okay} Redis ready`));
		client.on('reconnecting', () => console.log(`${Signs.warning} Redis reconnecting`));
	} catch (error) {
		console.log(`try catch error:`, error);
		client.on('error', err => console.log(`${Signs.error} Redis error: `, err));
	}
}

export async function getRedisRecord(email: string): Promise<string | null> {
	const value = await client.get(email);
	return value;
}

export async function delRedisRecord(email: string) {
	await client.del(email);
}

export async function stopRedis() {
	await client.quit();
	client.on('end', () => console.log(`${Signs.okay} Redis ended`));
}
