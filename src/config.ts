export const mode = {
	test: process.env.API_ENV === 'test',
	dev: process.env.API_ENV === 'local',
	prod: process.env.API_ENV === 'production'
};

export function getRuntimeConfig() {
	return {
		environment: process.env.API_ENV as string,
		apiKey: process.env.API_KEY as string
	};
}
