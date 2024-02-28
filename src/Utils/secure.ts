import bcrypt from 'bcrypt';
import crypto from 'crypto';

type PBKDF = { key: string; salt: string };

export const secure = {
	salt: () => {
		return crypto.randomBytes(16).toString('hex');
	},
	hash: async (text: string) => {
		return await bcrypt.hash(text, 10);
	},
	compare: async (text: string, hash: string) => {
		return await bcrypt.compare(text, hash);
	},
	/**
    ## Example usage:
    const password = 'mysecretpassword';
    generatePBKDF2Key(password)
        .then((derivedKey) => {
            console.log('PBKDF2 Key:', derivedKey);
            return derivedKey;
        })
        .catch((err) => {
            console.error('Error generating PBKDF2 key:', err);
        });
    */

	generatePBKDF2Key: (text: string, salt: string = crypto.randomBytes(16).toString('hex')): Promise<PBKDF> => {
		const iterations = 10000;
		const keyLength = 64;

		return new Promise((resolve, reject) => {
			crypto.pbkdf2(text, salt, iterations, keyLength, 'sha256', (err, derivedKey) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve({ key: derivedKey.toString('hex'), salt: salt });
				}
			});
		});
	},
	encrypt: (text: string, key16Bytes: string) => {
		const iv = crypto.randomBytes(12);
		const cipher = crypto.createCipheriv('aes-256-gcm', key16Bytes, iv);
		const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
		const tag = cipher.getAuthTag();
		const result = iv.toString('hex') + encrypted.toString('hex') + tag.toString('hex');
		return result;
	},
	decrypt: (text: string, key16Bytes: string) => {
		const ivHex = text.slice(0, 24);
		const encryptedText = text.slice(24, -32);
		const tagHex = text.slice(-32);

		const iv = Buffer.from(ivHex, 'hex');
		const encrypted = Buffer.from(encryptedText, 'hex');
		const tag = Buffer.from(tagHex, 'hex');

		const decipher = crypto.createDecipheriv('aes-256-gcm', key16Bytes, iv);
		decipher.setAuthTag(tag);

		let decrypted = decipher.update(encrypted);
		decrypted = Buffer.concat([decrypted, decipher.final()]);

		return decrypted.toString('utf8');
	}
};
