export const mode = {
	test: process.env.NODE_ENV === 'testing',
	dev: process.env.NODE_ENV === 'development',
	prod: process.env.NODE_ENV === 'production'
};

export function getRuntimeConfig() {
	return {
		environment: process.env.API_ENV as string
	};
}
