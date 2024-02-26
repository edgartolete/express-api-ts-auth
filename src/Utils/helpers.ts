import { client } from '../Connections/redis';
import { sendEmail } from '../Services/mailer';
import crypto from 'crypto';

export async function sendVerificationCode(email: string) {
	const randomCode: string = generateCode(6);
	await client.setEx(email, 300, randomCode);
	const payload = {
		to: email,
		subject: 'Verification Code',
		body: randomCode
	};
	sendEmail(payload);
}

export function generateCode(length: number) {
	/**
	 * Generate Random codes combination of numbers and letters
	 */
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let randomCode = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		randomCode += characters.charAt(randomIndex);
	}
	return randomCode;
}

export function generateId(): number {
	/**
	 * Generate 17 digits string Id using token random number plus current year, month, and milliseconds of the day
	 */
	const now: Date = new Date();
	const year: string = now.getFullYear().toString().padStart(4, '0');
	const month: string = (now.getMonth() + 1).toString().padStart(2, '0');
	const day: string = now.getDate().toString().padStart(2, '0');
	const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const millisecondsSinceStartOfDay: string = (now.getTime() - startOfDay.getTime()).toString().padStart(8, '0');
	const randomDigit: number = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
	const generatedId: string = `${randomDigit}${year}${month}${day}${millisecondsSinceStartOfDay}`;
	return parseInt(generatedId);
}

export async function fakeDelay(milliseconds: number) {
	const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
	await delay(milliseconds);
}

export function tryCatch<T>(callback: () => T): [T | null, Error | null] {
	/**
	 * Example usage:
	 * const [result, error] = tryCatch(()=> sum(2,4));
	 */
	try {
		const result = callback();
		return [result, null];
	} catch (error) {
		return [null, error instanceof Error ? error : new Error(String(error))];
	}
}

export async function tryCatchAsync<T>(callback: () => Promise<T>): Promise<[T | null, Error | null]> {
	/**
	 * Example usage:
	 * const [result, error] = await tryCatchAsync(() => divideAsync(10, 2));
	 */
	try {
		const result = await callback();
		return [result, null];
	} catch (error) {
		return [null, error instanceof Error ? error : new Error(String(error))];
	}
}

export function tokenCodeGenerator() {
	return crypto.randomBytes(64).toString('hex');
}
